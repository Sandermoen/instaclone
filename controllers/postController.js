const aws = require('aws-sdk');
const User = require('../models/User');
const fs = require('fs');
const ObjectId = require('mongoose').Types.ObjectId;

const {
  addPost,
  findPost,
  findComments,
  postComment
} = require('./utils/postControllerUtils');

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
  const { comment } = req.body;
  const query = comment ? 'comments' : 'posts';

  if (!postId) {
    return res
      .status(400)
      .send({ error: 'Please provide the post before attempting to like it.' });
  }
  try {
    const { username } = res.locals.user;
    let post = undefined;

    if (comment) {
      const document = await User.findOne(
        { 'comments._id': postId },
        'comments.$'
      );
      post = document.comments[0];
    } else {
      const document = await findPost(postId);
      post = document.posts[0];
    }

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
      { [`${query}._id`]: postId },
      {
        [`${query}.$.likes`]: post.likes,
        [`${query}.$.likesCount`]: post.likesCount
      }
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
  const { comment } = req.body;
  const user = res.locals.user;

  if (!comment) {
    return res.status(400).send({ error: 'You cannot post an empty comment.' });
  }

  try {
    const parent = await User.findOne({ 'posts._id': postId }, 'posts.$');
    if (!parent) {
      return res
        .status(404)
        .send({ error: 'Could not find a parent to post a comment to.' });
    }

    const updatedComments = await postComment(
      { postId, userId: user._id, date: Date.now(), message: comment },
      user._id,
      postId
    );

    const postedCommentId =
      updatedComments.comments[updatedComments.comments.length - 1]._id;

    return res.status(201).send({
      success: true,
      comment: {
        _id: postedCommentId,
        postId,
        date: Date.now(),
        commentsCount: 0,
        likesCount: 0,
        likes: [],
        message: comment,
        username: user.username,
        avatar: user.avatar
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports.addReply = async (req, res, next) => {
  const { comment, nested } = req.body;
  let { postId, commentId } = req.params;
  const user = res.locals.user;

  if (!commentId || !postId) {
    return res.status(400).send({
      error:
        'Please provide the required comment id and post id when replying to a comment.'
    });
  }
  if (!comment) {
    return res.status(400).send({ error: 'You cannot post an empty comment.' });
  }

  try {
    const parent = await User.findOne(
      { 'comments._id': commentId },
      'comments.$'
    );
    if (!parent) {
      return res
        .status(404)
        .send({ error: 'Could not find a parent to post a comment to.' });
    }

    if (nested) {
      commentId = parent.comments[0].postId;
    }

    const updatedComments = await postComment(
      {
        postId: commentId,
        userId: user._id,
        date: Date.now(),
        message: comment
      },
      user._id,
      postId
    );
    const postedCommentId =
      updatedComments.comments[updatedComments.comments.length - 1]._id;

    // Update the parent comment's commentsCount
    const parentCommentUpdate = await User.updateOne(
      { 'comments._id': commentId },
      { $inc: { 'comments.$.commentsCount': 1 } }
    );
    if (!parentCommentUpdate.nModified) {
      return res.status(500).send({
        error: 'Could not update parent comment commentCount.',
        parentCommentUpdate
      });
    }

    return res.status(201).send({
      success: true,
      comment: {
        _id: postedCommentId,
        postId: commentId,
        date: Date.now(),
        commentsCount: 0,
        likesCount: 0,
        likes: [],
        message: comment,
        username: user.username,
        avatar: user.avatar
      }
    });
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

module.exports.toggleBookmark = async (req, res, next) => {
  const user = res.locals.user;
  const { postId } = req.params;
  try {
    const userDocument = await User.findOne({
      _id: user._id,
      bookmarks: postId
    });
    // Has already bookmarked the post
    if (userDocument) {
      const bookmarkIndex = userDocument.bookmarks.findIndex(
        bookmark => bookmark === postId
      );
      userDocument.bookmarks.splice(bookmarkIndex, 1);
      await userDocument.save();
    } else {
      const bookmarkUpdate = await User.updateOne(
        { _id: user._id },
        { $push: { bookmarks: postId } }
      );
      if (!bookmarkUpdate.nModified)
        return res.status(500).send({ error: 'Could not update bookmarks.' });
    }

    return res.send({ success: true });
  } catch (err) {
    next(err);
  }
};

module.exports.deleteComment = async (req, res, next) => {
  const { postId, commentId } = req.params;
  const { nested } = req.body;
  const user = res.locals.user;
  let commentsCount = 1;

  try {
    const commentDocument = await User.findOne(
      {
        _id: user._id,
        'comments._id': commentId
      },
      'comments.$'
    );
    if (!commentDocument) {
      return res
        .status(404)
        .send({ error: 'Could not find a comment with that id.' });
    }
    const comment = commentDocument.comments[0];

    // If it is a parent comment find all comments that need to be removed
    if (!nested) {
      let comments = await User.aggregate([
        {
          $match: {
            $or: [
              { 'comments._id': ObjectId(commentId) },
              { 'comments.postId': commentId }
            ]
          }
        },
        {
          $project: {
            comments: {
              $filter: {
                input: '$comments',
                as: 'comment',
                cond: {
                  $or: [
                    { $eq: ['$$comment.postId', commentId] },
                    { $eq: ['$$comment._id', commentId] }
                  ]
                }
              }
            }
          }
        },
        { $unwind: '$comments' },
        {
          $group: {
            _id: '$comments._id',
            comments: { $push: '$comments' }
          }
        }
      ]);
      commentsCount += comments.length;
    } else {
      const parentCommentUpdate = await User.updateOne(
        {
          'comments._id': comment.postId
        },
        { $inc: { 'comments.$.commentsCount': -1 } }
      );
      if (!parentCommentUpdate.nModified) {
        return res
          .status(500)
          .send({ error: 'Error while updating parent comment count.' });
      }
    }

    // Decrementing the post's comment count
    const postCommentsCountUpdate = await User.updateOne(
      {
        'posts._id': postId
      },
      { $inc: { 'posts.$.commentsCount': -commentsCount } }
    );

    // Removing all comments with the postId or _id of commentId
    const commentsUpdate = await User.updateMany(
      {},
      {
        $pull: {
          comments: { $or: [{ _id: commentId }, { postId: commentId }] }
        }
      }
    );

    if (!postCommentsCountUpdate.nModified || !commentsUpdate.nModified) {
      return res.status(500).send({
        error: 'Could not update post.',
        postCommentsCountUpdate,
        commentsUpdate
      });
    }
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
};
