import authTypes from './userTypes';

export const INITIAL_STATE = {
  currentUser: null,
  error: false,
  token: localStorage.getItem('token')
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case authTypes.SIGN_IN_SUCCESS: {
      return {
        ...state,
        currentUser: action.payload.user,
        error: false,
        token: action.payload.token
      };
    }
    case authTypes.SIGN_IN_FAILURE: {
      return {
        ...state,
        error: action.payload
      };
    }
    case authTypes.SIGN_OUT: {
      return {
        ...state,
        currentUser: null,
        token: null
      };
    }
    default:
      return state;
  }
};

export default userReducer;
