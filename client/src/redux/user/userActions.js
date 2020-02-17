import userTypes from './userTypes';
import axios from 'axios';

export const setUser = user => ({
  type: userTypes.SET_USER,
  payload: user
});

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

export const signInStart = (usernameOrEmail, password) => async dispatch => {
  try {
    dispatch({ type: userTypes.SIGN_IN_START });
    const response = await axios.post('/auth/login', {
      usernameOrEmail,
      password
    });
    dispatch(signInSuccess(response.data));
  } catch (err) {
    dispatch(signInFailure(err.response.data));
  }
};
