import feedTypes from './feedTypes';

const INITIAL_STATE = {
  posts: [],
  fetching: true,
  error: false,
  hasMore: false,
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
        posts: [...state.posts, ...action.payload],
        hasMore: action.payload.length === 5,
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
    case feedTypes.REMOVE_POST: {
      const posts = JSON.parse(JSON.stringify(state.posts));
      const postIndex = posts.findIndex((post) => post._id === action.payload);
      if (postIndex) {
        posts.splice(postIndex, 1);
      }
      return {
        ...state,
        posts,
      };
    }
    case feedTypes.CLEAR_POSTS: {
      return {
        ...state,
        posts: [],
      };
    }
    default: {
      return state;
    }
  }
};

export default feedReducer;
