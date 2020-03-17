const User = require('../../models/User');

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

/**
 * Function to update the user's document with a new comment
 * @function postComment
 * @param {object} comment The comment to be pushed onto the user's comment array
 * @param {string} userId The user's id
 * @returns {object}
 */
const postComment = async (comment, userId, postId) => {
  try {
    const commentUpdate = await User.findOneAndUpdate(
      { _id: userId },
      {
        $push: {
          comments: comment
        }
      },
      { new: true, useFindAndModify: false }
    );

    if (!commentUpdate) throw new Error('Could not post comment.');

    // Update post comment count
    const postCommentCountUpdate = await User.updateOne(
      { 'posts._id': postId },
      { $inc: { 'posts.$.commentsCount': 1 } }
    );

    if (!postCommentCountUpdate.nModified) {
      throw new Error('Could not update post comments count.');
    }
    return commentUpdate;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  addPost,
  findPost,
  findComments,
  postComment
};
