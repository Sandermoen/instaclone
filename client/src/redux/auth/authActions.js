import authTypes from './authTypes';
import axios from 'axios';

export const authSuccess = () => ({
  type: authTypes.AUTH_SUCCESS
});

export const authFailure = err => ({
  type: authTypes.AUTH_FAILURE,
  payload: err
});

export const authStart = (email, password) => async dispatch => {
  try {
    const response = await axios.post('/api/auth', {
      data: {
        email,
        password
      }
    });
    dispatch(authSuccess(response.data));
  } catch (err) {
    dispatch(authFailure(err.response.data));
  }
};
