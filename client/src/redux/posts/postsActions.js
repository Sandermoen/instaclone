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

export const fetchPostComments = postId => async dispatch => {
  dispatch(fetchPostCommentsStart());
  try {
    const response = await axios.get(`/post/${postId}/comments`);
    dispatch(fetchPostCommentsSuccess(postId, response.data));
  } catch (err) {
    dispatch(fetchPostCommentsFailure(err.data));
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

export const addComment = (postId, comment) => ({
  type: postsTypes.ADD_COMMENT,
  payload: { postId, comment }
});

export const setReplyCommentId = commentId => ({
  type: postsTypes.SET_REPLY_ID,
  payload: commentId
});

export const clearReplyCommentId = () => ({
  type: postsTypes.CLEAR_REPLY_ID
});
