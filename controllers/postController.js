const aws = require('aws-sdk');
const User = require('../models/User');
const fs = require('fs');

/**
 * Add post with uploaded AWS url and caption
 * @function addPost
 * @param {string} imageUrl Url of the image to post.
 * @param {string} caption The caption to be included with the post.
 * @param {object} user The user object.
 */
const addPost = async (imageUrl, caption, user) => {
  try {
    // Update the user's profile with the post
    await User.updateOne(
      { _id: user._id },
      {
        $push: {
          posts: {
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

/**
 * Query for a post.
 * @param {string} postId Id of post to retrieve.
 * @returns {object} The post document.
 */
const findPost = async postId => {
  if (!postId) throw new Error('Please provide a post to retrieve.');
  try {
    const postDocument = await User.findOne(
      {
        'posts._id': postId
      },
      { 'posts.$': 1, username: 1, avatar: 1 }
    );
    if (!postDocument) throw new Error('Could not find post.');
    return postDocument;
  } catch (err) {
    throw new Error(err);
  }
};

/**
 * Query a parent for its comments
 * @function findComments
 * @param {string} parentId The id of the parent to query for comments.
 * @returns {array} Array of comments
 */
const findComments = async parentId => {
  // Query for a parent with the same postId and filter them by postId.
  try {
    const commentsDocument = await User.aggregate([
      { $match: { 'comments.postId': parentId } },
      {
        $project: {
          username: 1,
          avatar: 1,
          comments: {
            $filter: {
              input: '$comments',
              as: 'comment',
              cond: { $eq: ['$$comment.postId', parentId] }
            }
          }
        }
      },
      { $unwind: '$comments' },
      {
        $group: {
          _id: '$_id',
          username: { $first: '$username' },
          avatar: { $first: '$avatar' },
          comments: { $push: '$comments' }
        }
      }
    ]);

    // Might be able to improve this
    const comments = commentsDocument
      .map(document => {
        return document.comments.map(comment => {
          comment.username = document.username;
          if (document.avatar) comment.avatar = document.avatar;
          return comment;
        });
      })
      .flat();
    return comments;
  } catch (err) {
    throw new Error(err.message);
  }
};

const findComment = async commentId => {
  try {
    const commentDocument = await User.findOne(
      { 'comments._id': commentId },
      'comments.$.0'
    );
    if (!commentDocument) {
      throw new Error('Could not find comment.');
    }
    return commentDocument;
  } catch (err) {
    throw new Error(err.message);
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
    const post = postDocument.posts[0];

    if (post.likes.includes(username)) {
      // Post is already liked so remove user from like array
      const userIndex = post.likes.findIndex(user => user === username);
      post.likes.splice(userIndex, 1);
      post.likesCount -= 1;
    } else {
      // Post has not been liked so add user to like array
      post.likes.push(username);
      post.likesCount += 1;
    }
    // Update post
    const update = await User.updateOne(
      { 'posts._id': postId },
      { 'posts.$.likes': post.likes, 'posts.$.likesCount': post.likesCount }
    );

    if (!update.ok) return next('Failed to like post.');
    res.send({ success: true, likes: post.likes, likesCount: post.likesCount });
  } catch (err) {
    next(err);
  }
};

// Get a specific post with comments.
module.exports.getPost = async (req, res, next) => {
  const { postId } = req.params;
  try {
    const postDocument = await findPost(postId);
    const post = postDocument.posts[0];
    const comments = await findComments(postId);

    // Sort comments ascending.
    comments.sort((a, b) => new Date(b.date) - new Date(a.date)).reverse();

    return res.send({
      ...post.toObject(),
      comments
    });
  } catch (err) {
    next(err);
  }
};

module.exports.addComment = async (req, res, next) => {
  const { postId } = req.params;
  const { comment, reply } = req.body;
  const user = res.locals.user;

  if (!comment) {
    return res.status(400).send({ error: 'You cannot post an empty comment.' });
  }

  // return findComment(postId)
  //   .then(commentDocument => res.send(commentDocument))
  //   .catch(err => next(err));

  try {
    User.updateOne(
      { _id: user._id },
      {
        $push: {
          comments: {
            postId,
            userId: user._id,
            date: Date.now(),
            message: comment
          }
        }
      },
      async err => {
        if (err) return next(err);

        if (reply) {
          // Increment parent comment commentCount
          const update = await User.updateOne(
            { 'comments._id': postId },
            { $inc: { 'comments.$.commentCount': 1 } }
          );
          Promise.reject();
          if (!update.ok) return next('Could not update comment count.');
        } else {
          // Increment parent post commentCount
          const update = await User.updateOne(
            { 'posts._id': postId },
            { $inc: { 'posts.$.commentCount': 1 } }
          );
          if (!update.ok) return next('Could not update comment count.');
        }

        return res.status(201).send({
          success: true,
          comment: {
            message: comment,
            username: user.username,
            avatar: user.avatar
          }
        });
      }
    );
  } catch (err) {
    next(err);
  }
};

// Get child comments on a comment
// Comments should only nest 1 level
module.exports.getComments = async (req, res, next) => {
  const { commentId } = req.params;
  if (!commentId) {
    return res.status(400).send({
      error:
        'Please provide the comment before attempting to retrieve its children'
    });
  }

  try {
    const comments = await findComments(commentId);
    // Sort comments ascending.
    comments.sort((a, b) => new Date(b.date) - new Date(a.date)).reverse();
    res.send(comments);
  } catch (err) {
    next(err);
  }
};
