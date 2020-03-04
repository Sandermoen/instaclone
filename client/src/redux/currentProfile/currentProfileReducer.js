import currentProfileTypes from './currentProfileTypes';

const INITIAL_STATE = {
  profile: null,
  error: false,
  fetching: false
};

const currentProfileReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case currentProfileTypes.FETCH_PROFILE_START: {
      return { ...state, fetching: true };
    }
    case currentProfileTypes.FETCH_PROFILE_SUCCESS: {
      return {
        ...state,
        error: false,
        fetching: false,
        profile: action.payload
      };
    }
    case currentProfileTypes.FETCH_PROFILE_FAILURE: {
      return { ...state, error: action.payload, fetching: false };
    }
    case currentProfileTypes.LIKE_POST: {
      const { postId, username, decrement } = action.payload;
      // Copy the posts array to modify it
      // A deep copy of the posts array might not be the best idea
      // Will look into this later
      const posts = JSON.parse(JSON.stringify(state.profile.posts));

      // Increment or decrement the likes by one
      state.profile.posts.find((post, idx) => {
        if (post.postId === postId) {
          if (decrement) {
            const userIdx = posts[idx].likes.findIndex(
              like => like === username
            );
            posts[idx].likes.splice(userIdx, 1);
          } else {
            posts[idx].likes.push(username);
          }
          return posts[idx];
        }
        return null;
      });
      return { ...state, profile: { ...state.profile, posts } };
    }
    default: {
      return state;
    }
  }
};

export default currentProfileReducer;
