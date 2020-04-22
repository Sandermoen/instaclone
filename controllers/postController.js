const cloudinary = require('cloudinary').v2;
const Post = require('../models/Post');
const PostVote = require('../models/PostVote');
const fs = require('fs');
const ObjectId = require('mongoose').Types.ObjectId;

const { retrieveComments } = require('./utils');

module.exports.createPost = async (req, res, next) => {
  const user = res.locals.user;
  const { caption } = req.body;

  if (!req.file) {
    return res
      .status(400)
      .send({ error: 'Please provide the req.file to upload.' });
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  cloudinary.uploader.upload(
    req.file.path,
    {
      eager: [{ width: 300, height: 300, crop: 'fit' }],
    },
    async (err, result) => {
      if (err) next(err);
      if (result) {
        try {
          fs.unlinkSync(req.file.path);
          const post = new Post({
            image: result.secure_url,
            thumbnail: result.eager[0].secure_url,
            caption,
            author: user._id,
          });
          const postVote = new PostVote({
            post: post._id,
          });
          await post.save();
          await postVote.save();
          return res.status(201).send(result);
        } catch (err) {
          next(err);
        }
      }
    }
  );
};

module.exports.deletePost = async (req, res, next) => {
  const { postId } = req.params;
  const user = res.locals.user;

  try {
    const post = await Post.findOne({ _id: postId, author: user._id });
    if (!post) {
      return res.status(404).send({
        error: 'Could not find a post with that id associated with the user.',
      });
    }
    // This uses pre hooks to delete everything associated with this post i.e comments
    const postDelete = await Post.deleteOne({
      _id: postId,
    });
    if (!postDelete.deletedCount) {
      return res.status(500).send({ error: 'Could not delete the post.' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports.retrievePost = async (req, res, next) => {
  const { postId } = req.params;
  try {
    // Retrieve the post and the post's votes
    const post = await Post.aggregate([
      { $match: { _id: ObjectId(postId) } },
      {
        $lookup: {
          from: 'postvotes',
          localField: '_id',
          foreignField: 'post',
          as: 'postVotes',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'author',
        },
      },
      { $unwind: '$author' },
      {
        $unset: [
          'author.password',
          'author.email',
          'author.private',
          'author.bio',
        ],
      },
    ]);
    if (post.length === 0) {
      return res
        .status(404)
        .send({ error: 'Could not find a post with that id.' });
    }
    // Retrieve the comments associated with the post aswell as the comment's replies and votes
    const comments = await retrieveComments(postId, 0);

    return res.send({ ...post[0], commentData: comments });
  } catch (err) {
    next(err);
  }
};

module.exports.votePost = async (req, res, next) => {
  const { postId } = req.params;
  const user = res.locals.user;

  try {
    // Update the vote array if the user has not already liked the post
    const postLikeUpdate = await PostVote.updateOne(
      { post: postId, 'votes.author': { $ne: user._id } },
      {
        $push: { votes: { author: user._id } },
      }
    );
    if (!postLikeUpdate.nModified) {
      if (!postLikeUpdate.ok) {
        return res.status(500).send({ error: 'Could not vote on the post.' });
      }
      // Nothing was modified in the previous query meaning that the user has already liked the post
      // Remove the user's like
      const postDislikeUpdate = await PostVote.updateOne(
        { post: postId },
        { $pull: { votes: { author: user._id } } }
      );

      if (!postDislikeUpdate.nModified) {
        return res.status(500).send({ error: 'Could not vote on the post.' });
      }
    }
    return res.send({ success: true });
  } catch (err) {
    next(err);
  }
};
