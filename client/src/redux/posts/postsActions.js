import axios from 'axios';

import postsTypes from './postsTypes';

const fetchPostDetailsFailure = error => ({
  type: postsTypes.FETCH_POST_DETAILS_FAILURE,
  payload: error
});

const fetchPostDetailsSuccess = () => ({
  type: postsTypes.FETCH_POST_DETAILS_SUCCESS
});

export const fetchPostDetailsStart = (postId, username, authToken) => (
  dispatch,
  getState
) => {
  const state = getState();
  if (
    !state.posts.data[postId].comments &&
    !state.posts.data[postId].bookmarked
  ) {
    dispatch({ type: 'FETCH_POST_DETAILS_START' });
    Promise.all([
      fetchBookmark(postId, username, authToken),
      fetchPostComments(postId)
    ])
      .then(([bookmarked, comments]) => {
        dispatch(setBookmarked(postId, bookmarked));
        dispatch(setPostComments(postId, comments));
        dispatch(fetchPostDetailsSuccess());
      })
      .catch(err => dispatch(fetchPostDetailsFailure(err)));
  }
};

const setPostComments = (postId, comments) => ({
  type: postsTypes.SET_POST_COMMENTS,
  payload: { postId, comments }
});

const setBookmarked = (postId, bookmarked) => ({
  type: postsTypes.SET_BOOKMARKED,
  payload: { postId, bookmarked }
});

const vote = async (postId, authToken, comment) => {
  try {
    const response = await axios.post(
      `/post/${postId}/vote`,
      comment ? { comment } : null,
      {
        headers: {
          authorization: authToken
        }
      }
    );
    return response;
  } catch (err) {
    throw new Error('Unable to vote on the post.');
  }
};

export const fetchPostComments = async postId => {
  try {
    const response = await axios.get(`/post/${postId}/comments`);
    return response.data;
  } catch (err) {
    throw new Error(err);
  }
};

export const fetchBookmark = async (postId, username, authToken) => {
  try {
    const response = await axios.get(`/user/${username}/bookmarks`, {
      headers: { authorization: authToken }
    });
    if (response.data.includes(postId)) {
      return true;
    }
    return false;
  } catch (err) {
    throw new Error(err);
  }
};

export const toggleBookmark = (postId, authToken) => async dispatch => {
  // Immediately dispatch bookmark action as the interaction has to be fast
  dispatch({ type: postsTypes.TOGGLE_BOOKMARK, payload: postId });
  await axios.post(`/post/${postId}/bookmark`, null, {
    headers: { authorization: authToken }
  });
};

export const addPosts = posts => ({
  type: postsTypes.ADD_POSTS,
  payload: posts
});

export const votePost = (postId, authToken) => async dispatch => {
  try {
    const response = await vote(postId, authToken);
    dispatch({
      type: postsTypes.VOTE_POST,
      payload: { postId, response: response.data }
    });
  } catch (err) {
    // TODO: Make notification system to handle errors like these
    console.warn(err);
  }
};

export const voteComment = (
  postId,
  commentId,
  parentCommentId,
  authToken
) => async dispatch => {
  try {
    const response = await vote(commentId, authToken, true);
    dispatch({
      type: postsTypes.VOTE_COMMENT,
      payload: {
        postId,
        commentId,
        parentCommentId,
        response: response.data
      }
    });
  } catch (err) {
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

export const deleteComment = (
  postId,
  commentId,
  nestedCommentId,
  authToken
) => async dispatch => {
  dispatch({
    type: postsTypes.DELETE_COMMENT,
    payload: { postId, commentId, nestedCommentId }
  });
  try {
    await axios.delete(
      `/post/${postId}/${nestedCommentId ? nestedCommentId : commentId}`,
      {
        headers: {
          authorization: authToken
        },
        data: {
          nested: !!nestedCommentId
        }
      }
    );
  } catch (err) {
    console.warn(err);
  }
};

export const setReplyComment = (
  commentId,
  username,
  toggleComments,
  nested = false,
  parentCommentId
) => ({
  type: postsTypes.SET_REPLY_COMMENT,
  payload: { commentId, username, toggleComments, nested, parentCommentId }
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

export const clearPosts = () => ({
  type: postsTypes.CLEAR_POSTS
});
