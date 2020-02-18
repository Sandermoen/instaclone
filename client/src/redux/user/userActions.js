import userTypes from './userTypes';
import axios from 'axios';

const signOut = () => {
  localStorage.removeItem('token');
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
  token
) => async dispatch => {
  const request =
    usernameOrEmail && password
      ? { data: { usernameOrEmail, password } }
      : { headers: { authorization: token } };
  try {
    dispatch({ type: userTypes.SIGN_IN_START });
    const response = await axios('/auth/login', { method: 'POST', ...request });
    dispatch(signInSuccess(response.data));
  } catch (err) {
    if (token) dispatch(signOut);
    dispatch(signInFailure(err.response.data));
  }
};
