import authTypes from './authTypes';

export const INITIAL_STATE = {
  auth: null,
  error: false
};

const authReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case authTypes.AUTH_SUCCESS: {
      return {
        ...state,
        auth: true,
        error: false
      };
    }
    case authTypes.AUTH_FAILURE: {
      return {
        ...state,
        auth: false,
        error: action.payload
      };
    }
    default:
      return state;
  }
};

export default authReducer;
