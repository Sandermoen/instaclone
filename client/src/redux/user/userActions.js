import userTypes from './userTypes';
import axios from 'axios';

export const signInSuccess = user => ({
  type: userTypes.SIGN_IN_SUCCESS,
  payload: user
});

export const signInFailure = err => ({
  type: userTypes.SIGN_IN_FAILURE,
  payload: err
});

export const signInStart = (email, password) => async dispatch => {
  try {
    dispatch({ type: userTypes.SIGN_IN_START });
    const response = await axios.post('/api/auth', {
      data: {
        email,
        password
      }
    });
    dispatch(signInSuccess(response.data));
  } catch (err) {
    dispatch(signInFailure(err.response.data));
  }
};
