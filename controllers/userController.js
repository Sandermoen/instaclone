const User = require('../models/User');
const Post = require('../models/Post');
const Followers = require('../models/Followers');
const Following = require('../models/Following');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports.retrieveUser = async (req, res, next) => {
  const { username } = req.params;
  try {
    const user = await User.findOne(
      { username },
      'username avatar bio bookmarks _id'
    );
    if (!user) {
      return res
        .status(404)
        .send({ error: 'Could not find a user with that username.' });
    }

    const posts = await Post.aggregate([
      { $match: { author: ObjectId(user._id) } },
      { $limit: 12 },
      { $sort: { date: -1 } },
      {
        $lookup: {
          from: 'postvotes',
          localField: '_id',
          foreignField: 'post',
          as: 'postvotes'
        }
      },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'post',
          as: 'comments'
        }
      },
      {
        $lookup: {
          from: 'commentreplies',
          localField: 'comments._id',
          foreignField: 'parentComment',
          as: 'commentReplies'
        }
      },
      {
        $unwind: '$postvotes'
      },
      {
        $project: {
          user: true,
          followers: true,
          following: true,
          comments: {
            $sum: [{ $size: '$comments' }, { $size: '$commentReplies' }]
          },
          image: true,
          caption: true,
          author: true,
          postVotes: { $size: '$postvotes.votes' }
        }
      }
    ]);

    const followers = await Followers.findOne({
      user: ObjectId(user._id)
    }).countDocuments();

    const following = await Following.findOne({
      user: ObjectId(user._id)
    }).countDocuments();
    return res.send({ user, followers, following, posts });
  } catch (err) {
    next(err);
  }
};

module.exports.retrievePosts = async (req, res, next) => {
  // Retrieve a user's posts with the post's comments & likes
  const { username } = req.params;
  try {
    const posts = await Post.aggregate([
      { $limit: 12 },
      { $sort: { date: -1 } },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $match: { 'user.username': username } },
      {
        $lookup: {
          from: 'comments',
          localField: 'author',
          foreignField: 'author',
          as: 'comments'
        }
      },
      {
        $lookup: {
          from: 'postvotes',
          localField: 'author',
          foreignField: 'post',
          as: 'postvotes'
        }
      },
      {
        $project: {
          image: true,
          caption: true,
          date: 1,
          'user.username': true,
          'user.avatar': true,
          comments: { $size: '$comments.votes' },
          postvotes: { $size: '$postvotes.votes' }
        }
      }
    ]);
    if (posts.length === 0) {
      return res.status(404).send({ error: 'Could not find any posts.' });
    }
    return res.send(posts);
  } catch (err) {
    next(err);
  }
};

module.exports.bookmarkPost = async (req, res, next) => {
  const { postId } = req.params;
  const user = res.locals.user;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .send({ error: 'Could not find a post with that id.' });
    }

    const userBookmarkUpdate = await User.updateOne(
      {
        _id: user._id,
        'bookmarks.post': { $ne: postId }
      },
      { $push: { bookmarks: { post: postId } } }
    );
    if (!userBookmarkUpdate.nModified) {
      if (!userBookmarkUpdate.ok) {
        return res.status(500).send({ error: 'Could not bookmark the post.' });
      }
      // The above query did not modify anything meaning that the user has already bookmarked the post
      // Remove the bookmark instead
      const userRemoveBookmarkUpdate = await User.updateOne(
        { _id: user._id },
        { $pull: { bookmarks: { post: postId } } }
      );
      if (!userRemoveBookmarkUpdate.nModified) {
        return res.status(500).send({ error: 'Could not bookmark the post.' });
      }
      return res.send({ success: true, operation: 'remove' });
    }
    return res.send({ success: true, operation: 'add' });
  } catch (err) {
    next(err);
  }
};
