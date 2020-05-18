import feedTypes from './feedTypes';

const INITIAL_STATE = {
  posts: [],
  fetching: true,
  error: false,
};

const feedReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case feedTypes.FETCH_POSTS_START: {
      return {
        ...state,
        fetching: true,
        error: false,
      };
    }
    case feedTypes.FETCH_POSTS_SUCCESS: {
      return {
        ...state,
        fetching: false,
        error: false,
        posts: action.payload,
      };
    }
    case feedTypes.FETCH_POSTS_FAILURE: {
      return {
        ...state,
        fetching: false,
        error: action.payload,
      };
    }
    case feedTypes.ADD_POST: {
      return {
        ...state,
        posts: [action.payload, ...state.posts],
      };
    }
    default: {
      return state;
    }
  }
};

export default feedReducer;
