import axios from 'axios';

import currentProfileTypes from './currentProfileTypes';

export const fetchProfileSuccess = profile => ({
  type: currentProfileTypes.FETCH_PROFILE_SUCCESS,
  payload: profile
});

export const fetchProfileFailure = error => ({
  type: currentProfileTypes.FETCH_PROFILE_FAILURE,
  payload: error
});

export const fetchCurrentProfileStart = username => async dispatch => {
  try {
    dispatch({ type: currentProfileTypes.FETCH_PROFILE_START });
    const response = await axios.get(`/user/${username}`);
    return dispatch(fetchProfileSuccess(response.data));
  } catch (err) {
    return dispatch(fetchProfileFailure(err));
  }
};

export const likePost = (postId, authToken, username) => async dispatch => {
  try {
    dispatch({
      type: currentProfileTypes.LIKE_POST,
      payload: { postId, username }
    });
    await axios({
      method: 'POST',
      url: `/post/${postId}/vote`,
      headers: {
        authorization: authToken
      }
    });
  } catch (err) {}
};
