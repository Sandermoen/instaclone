import authTypes from './userTypes';

export const INITIAL_STATE = {
  currentUser: null,
  error: false
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case authTypes.SIGN_IN_SUCCESS: {
      return {
        ...state,
        currentUser: action.payload,
        error: false
      };
    }
    case authTypes.SIGN_IN_FAILURE: {
      return {
        ...state,
        error: action.payload
      };
    }
    default:
      return state;
  }
};

export default userReducer;
