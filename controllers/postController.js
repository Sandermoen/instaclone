const aws = require('aws-sdk');
const User = require('../models/User');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const short = require('short-uuid')();

const { verifyJwt } = require('./authController');

const addPost = async (imageUrl, caption, authorization) => {
  try {
    const user = await verifyJwt(authorization);
    await User.updateOne(
      { _id: user._id },
      {
        $push: {
          posts: {
            postId: short.fromUUID(uuidv4()),
            image: imageUrl,
            caption,
            date: Date.now()
          }
        }
      }
    );
  } catch (err) {
    throw new Error(err);
  }
};

module.exports.uploadFile = (req, res, next) => {
  const { authorization } = req.headers;
  const { caption } = req.body;
  aws.config.setPromisesDependency();
  aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  });
  const params = {
    ACL: 'public-read',
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Body: fs.createReadStream(req.file.path),
    Key: `images/${req.file.originalname}`
  };
  const s3 = new aws.S3();
  s3.upload(params, (err, data) => {
    if (err) next(err);
    if (data) {
      fs.unlinkSync(req.file.path);
      const resourceLocation = data.Location;
      try {
        addPost(resourceLocation, caption, authorization);
        return res.status(201).send(resourceLocation);
      } catch (err) {
        return res.status(401).send({ error: err });
      }
    }
  });
};

module.exports.votePost = async (req, res, next) => {
  const { authorization } = req.headers;
  const { postId } = req.params;
  if (!postId) {
    return res
      .status(400)
      .send({ error: 'Please provide the post before attempting to like it.' });
  }
  try {
    const { username } = await verifyJwt(authorization);
    // Need to check if user has already liked the post before.
    User.findOne({ 'posts.postId': postId }, 'posts.$', (err, document) => {
      if (err) return next(err);
      if (document.posts[0].likes.includes(username)) {
        return User.updateOne(
          { 'posts.postId': postId },
          { $pull: { 'posts.$.likes': username } },
          err => {
            if (err) return next(err);
            return res.send({ success: true });
          }
        );
      } else {
        return User.updateOne(
          { 'posts.postId': postId },
          { $push: { 'posts.$.likes': username } },
          err => {
            if (err) return next(err);
            return res.send({ success: true });
          }
        );
      }
      return res.send(document);
    });
  } catch (err) {
    res.status(401).send({ error: err });
  }
};
