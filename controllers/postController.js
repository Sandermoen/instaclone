const aws = require('aws-sdk');
const User = require('../models/User');
const Post = require('../models/Post');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const short = require('short-uuid')();

const { verifyJwt } = require('./authController');

const addPost = async (imageUrl, caption, authorization) => {
  try {
    const user = await verifyJwt(authorization);
    const postId = short.fromUUID(uuidv4());
    // Update the user's profile with the basic post information
    await User.updateOne(
      { _id: user._id },
      {
        $push: {
          posts: {
            postId,
            image: imageUrl
          }
        }
      }
    );
    // Update the posts document with the post and all the comments and likes etc..
    await Post.updateOne(
      { username: user.username },
      {
        $set: {
          [`posts.${postId}`]: {
            caption,
            image: imageUrl,
            date: Date.now(),
            likes: [],
            comments: []
          }
        }
      },
      err => {
        if (err) return next(err);
      }
    );
  } catch (err) {
    throw new Error(err);
  }
};

// Upload the received file to amazon s3
// Might switch to cloudinary instead
module.exports.uploadFile = (req, res, next) => {
  const { authorization } = req.headers;
  const { caption } = req.body;

  aws.config.setPromisesDependency();
  aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  });

  // S3 bucket config
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

    Post.findOne(
      { [`posts.${postId}`]: { $exists: true } },
      (err, document) => {
        if (err) return next(err);
        if (!document) return res.status(404).send('Could not find the post.');

        let post = document.posts.get(postId);
        if (post.likes.includes(username)) {
          // Post is already liked so remove user from like array
          const userIndex = post.likes.findIndex(user => user === username);
          post.likes.splice(userIndex, 1);
          document.posts.set(postId, post);
        } else {
          // Post has not been liked so add user to like array
          post.likes.push(username);
          document.posts.set(postId, post);
        }

        document.save((err, updatedDocument) => {
          if (err) return next(err);
          post = updatedDocument.posts.get(postId);
        });

        // Update the user collection with the updated like number
        return User.updateOne(
          { 'posts.postId': postId },
          { 'posts.$.likesCount': post.likes.length },
          err => {
            if (err) return next(err);
            return res.send({ likes: post.likes });
          }
        );
      }
    );
  } catch (err) {
    res.status(401).send({ error: err });
  }
};

// Get post details (caption, likes, comments) etc..
module.exports.getPost = (req, res, next) => {
  const { postId } = req.params;
  if (!postId)
    return res
      .status(400)
      .send({ error: 'Please provide a post to retrieve.' });

  Post.findOne({ [`posts.${postId}`]: { $exists: true } }, (err, document) => {
    if (err) return next(err);
    if (!document || !document.posts.get(postId))
      return res.status(404).send('That user or post does not exist.');
    // Use the postId to get the post from the Map using .get
    const post = document.posts.get(postId);
    res.send({ ...post, postId });
  });
};
