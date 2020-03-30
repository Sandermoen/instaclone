import axios from 'axios';

/**
 * Creates a comment on a specific post
 * @function createComment
 * @param {string} message The message to be posted as a comment
 * @param {string} postId The id of the post to comment on
 * @param {string} authToken A user's auth token
 * @returns {object} The created comment
 */
export const createComment = async (message, postId, authToken) => {
  try {
    const response = await axios.post(
      `/comment/${postId}`,
      { message },
      {
        headers: {
          authorization: authToken
        }
      }
    );
    return response.data;
  } catch (err) {
    throw new Error(err);
  }
};

/**
 * Deletes a comment with a specified comment id provided it was created by the user
 * @function deleteComment
 * @param {string} commentId Id of the comment to delete
 * @param {string} authToken A user's auth token
 */
export const deleteComment = async (commentId, authToken) => {
  try {
    await axios.delete(`/comment/${commentId}`, {
      headers: {
        authorization: authToken
      }
    });
  } catch (err) {
    throw new Error(err);
  }
};

/**
 * Votes on a comment
 * @function voteComment
 * @param {string} commentId Id of the comment to vote on
 * @param {string} authToken A user's auth token
 */
export const voteComment = async (commentId, authToken) => {
  try {
    await axios.post(`/comment/${commentId}/vote`, null, {
      headers: { authorization: authToken }
    });
  } catch (err) {
    throw new Error(err);
  }
};

/**
 * Creates a reply to a specific comment
 * @function createCommentReply
 * @param {string} message The message to be replied with to a comment
 * @param {string} parentCommentId The id of the comment to be replied to
 * @param {string} authToken A user's auth token
 * @returns {object} The created comment reply
 */
export const createCommentReply = async (
  message,
  parentCommentId,
  authToken
) => {
  try {
    const response = await axios.post(
      `/comment/${parentCommentId}/reply`,
      { message },
      {
        headers: {
          authorization: authToken
        }
      }
    );
    return response.data;
  } catch (err) {
    throw new Error(err);
  }
};

/**
 * Deletes a comment reply with a specified comment reply id provided it was created by the user
 * @function deleteCommentReply
 * @param {string} commentReplyId Id of the comment reply to vote on
 * @param {string} authToken A user's auth token
 */
export const deleteCommentReply = async (commentReplyId, authToken) => {
  try {
    await axios.delete(`/comment/${commentReplyId}/reply`, {
      headers: {
        authorization: authToken
      }
    });
  } catch (err) {
    throw new Error(err);
  }
};

/**
 * Votes on a comment reply
 * @function voteCommentReply
 * @param {string} commentReplyId Id of the comment reply to vote on
 * @param {string} authToken A user's auth token
 */
export const voteCommentReply = async (commentReplyId, authToken) => {
  try {
    await axios.post(`/comment/${commentReplyId}/replyVote`, null, {
      headers: { authorization: authToken }
    });
  } catch (err) {
    throw new Error(err);
  }
};

/**
 * Gets 3 new replies from a parent comment
 * @function getCommentReplies
 * @param {string} parentCommentId The id of a parent comment to get replies from
 * @param {number} offset A number to offset the results
 * @returns {array} Array of replies
 */
export const getCommentReplies = async (parentCommentId, offset = 0) => {
  try {
    const response = await axios.get(
      `/comment/${parentCommentId}/${offset}/replies`
    );
    return response.data;
  } catch (err) {
    throw new Error(err);
  }
};
