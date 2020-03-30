import userTypes from './userTypes';
import axios from 'axios';

import { clearPosts } from '../posts/postsActions';

const signOut = () => dispatch => {
  localStorage.removeItem('token');
  dispatch(clearPosts);
  return {
    type: userTypes.SIGN_OUT
  };
};

export const signInSuccess = user => {
  localStorage.setItem('token', user.token);
  return {
    type: userTypes.SIGN_IN_SUCCESS,
    payload: user
  };
};

export const signInFailure = err => ({
  type: userTypes.SIGN_IN_FAILURE,
  payload: err
});

export const signInStart = (
  usernameOrEmail,
  password,
  authToken
) => async dispatch => {
  const request =
    usernameOrEmail && password
      ? { data: { usernameOrEmail, password } }
      : { headers: { authorization: authToken } };
  try {
    dispatch({ type: userTypes.SIGN_IN_START });
    const response = await axios('/auth/login', { method: 'POST', ...request });
    dispatch(signInSuccess(response.data));
  } catch (err) {
    if (authToken) dispatch(signOut);
    dispatch(signInFailure(err.response.data));
  }
};

export const bookmarkPost = (postId, authToken) => async dispatch => {
  try {
    const response = await axios.post(`/user/${postId}/bookmark`, null, {
      headers: { authorization: authToken }
    });
    dispatch({
      type: userTypes.BOOKMARK_POST,
      payload: { ...response.data, postId }
    });
  } catch (err) {
    console.warn(err);
  }
};
