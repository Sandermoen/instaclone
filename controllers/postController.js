const aws = require('aws-sdk');
const User = require('../models/User');
const Post = require('../models/Post');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const short = require('short-uuid')();

const addPost = async (imageUrl, caption, user) => {
  try {
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
        addPost(resourceLocation, caption, res.locals.user);
        return res.status(201).send(resourceLocation);
      } catch (err) {
        return res.status(401).send({ error: err });
      }
    }
  });
};

const findPost = async postId => {
  if (!postId) throw new Error('Please provide a post to retrieve.');
  try {
    const postDocument = await Post.findOne({
      [`posts.${postId}`]: { $exists: true }
    });
    return postDocument;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports.votePost = async (req, res, next) => {
  const { postId } = req.params;
  if (!postId) {
    return res
      .status(400)
      .send({ error: 'Please provide the post before attempting to like it.' });
  }
  try {
    const { username } = res.locals.user;
    const postDocument = await findPost(postId);
    let post = postDocument.posts.get(postId);
    if (post.likes.includes(username)) {
      // Post is already liked so remove user from like array
      const userIndex = post.likes.findIndex(user => user === username);
      post.likes.splice(userIndex, 1);
      postDocument.posts.set(postId, post);
    } else {
      // Post has not been liked so add user to like array
      post.likes.push(username);
      postDocument.posts.set(postId, post);
    }

    postDocument.save((err, updatedDocument) => {
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
  } catch (err) {
    res.status(401).send({ error: err });
  }
};

// Get post details (caption, likes, comments) etc..
module.exports.getPost = async (req, res, next) => {
  const { postId } = req.params;
  try {
    const postDocument = await findPost(postId);
    const post = postDocument.posts.get(postId);
    return res.send({ ...post, postId });
  } catch (err) {
    return res.status(400).send({ error: err.message });
  }
};

module.exports.addComment = async (req, res, next) => {
  const { postId } = req.params;
  let { comment } = req.body;
  const user = res.locals.user;

  if (!comment) {
    return res
      .status(400)
      .send({ error: 'You cannot post and empty comment.' });
  }

  try {
    const postDocument = await findPost(postId);
    const post = postDocument.posts.get(postId);
    comment = { comment, username: user.username };
    post.comments.push(comment);
    postDocument.posts.set(postId, post);

    return postDocument.save(err => {
      if (err) next(err);
      res
        .status(201)
        .send({ success: true, comment: { ...comment, avatar: user.avatar } });
    });
  } catch (err) {
    return res.status(400).send({ error: err.message });
  }
};
