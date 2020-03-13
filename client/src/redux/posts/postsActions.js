import axios from 'axios';

import postsTypes from './postsTypes';

const fetchPostCommentsStart = () => ({
  type: postsTypes.FETCH_POST_COMMENTS_START
});

const fetchPostCommentsFailure = error => ({
  type: postsTypes.FETCH_POST_COMMENTS_FAILURE,
  payload: error
});

const fetchPostCommentsSuccess = (postId, comments) => ({
  type: postsTypes.FETCH_POST_COMMENTS_SUCCESS,
  payload: { postId, comments }
});

export const fetchPostComments = postId => async (dispatch, getState) => {
  const state = getState();
  if (!state.posts.data[postId].comments) {
    dispatch(fetchPostCommentsStart());
    try {
      const response = await axios.get(`/post/${postId}/comments`);
      dispatch(fetchPostCommentsSuccess(postId, response.data));
    } catch (err) {
      dispatch(fetchPostCommentsFailure(err.data));
    }
  }
};

export const addPosts = posts => ({
  type: postsTypes.ADD_POSTS,
  payload: posts
});

export const likePost = (postId, authToken) => async dispatch => {
  try {
    const response = await axios.post(`/post/${postId}/vote`, null, {
      headers: {
        authorization: authToken
      }
    });
    dispatch({
      type: postsTypes.LIKE_POST,
      payload: { postId, response: response.data }
    });
  } catch (err) {
    // TODO: Make notification system to handle errors like these
    console.warn(err);
  }
};

export const addCommentReply = (postId, commentId, comment) => ({
  type: postsTypes.ADD_COMMENT_REPLY,
  payload: { postId, commentId, comment }
});

export const addComment = (postId, comment) => (dispatch, getState) => {
  const state = getState();
  const replyComment = state.posts.replyComment;
  if (replyComment) {
    dispatch(addCommentReply(postId, replyComment.commentId, comment));
  } else {
    dispatch({
      type: postsTypes.ADD_COMMENT,
      payload: { postId, comment }
    });
  }
};

export const setReplyComment = (commentId, username, toggleComments) => ({
  type: postsTypes.SET_REPLY_COMMENT,
  payload: { commentId, username, toggleComments }
});

export const clearReplyComment = () => ({
  type: postsTypes.CLEAR_REPLY_COMMENT
});

export const fetchCommentReplies = (postId, commentId) => async (
  dispatch,
  getState
) => {
  const state = getState();
  const comment = state.posts.data[postId].comments.find(
    comment => comment._id === commentId
  );
  // Prevent refetch on toggle if comments have already been fetched
  if (!comment.hasOwnProperty('replies')) {
    try {
      const response = await axios.get(`/post/${commentId}/comments`);
      dispatch({
        type: postsTypes.SET_COMMENT_REPLIES,
        payload: { postId, commentId, comments: response.data }
      });
    } catch (err) {
      console.warn(err);
    }
  }
};

export const toggleShowComments = (postId, commentId) => ({
  type: postsTypes.TOGGLE_SHOW_COMMENTS,
  payload: { postId, commentId }
});
