import userTypes from './userTypes';
import axios from 'axios';

import { bookmarkPost as bookmark } from '../../services/postService';
import { registerUser, login } from '../../services/authenticationServices';

const signOut = () => {
  localStorage.removeItem('token');
  return {
    type: userTypes.SIGN_OUT,
  };
};

export const signInSuccess = (user) => {
  localStorage.setItem('token', user.token);
  return {
    type: userTypes.SIGN_IN_SUCCESS,
    payload: user,
  };
};

export const signInFailure = (err) => ({
  type: userTypes.SIGN_IN_FAILURE,
  payload: err,
});

export const signInStart = (usernameOrEmail, password, authToken) => async (
  dispatch
) => {
  try {
    dispatch({ type: userTypes.SIGN_IN_START });
    const response = await login(usernameOrEmail, password, authToken);
    dispatch(signInSuccess(response));
  } catch (err) {
    if (authToken) dispatch(signOut);
    dispatch(signInFailure({ error: err.message }));
  }
};

export const signUpStart = (email, fullName, username, password) => async (
  dispatch
) => {
  try {
    dispatch({ type: userTypes.SIGN_IN_START });
    const response = await registerUser(email, fullName, username, password);
    dispatch(signInStart(null, null, response.token));
  } catch (err) {
    dispatch({ type: userTypes.SIGN_UP_FAILURE, payload: err.message });
  }
};

export const bookmarkPost = (postId, authToken) => async (dispatch) => {
  try {
    const response = await bookmark(postId, authToken);
    dispatch({
      type: userTypes.BOOKMARK_POST,
      payload: { ...response, postId },
    });
  } catch (err) {
    return err;
  }
};
