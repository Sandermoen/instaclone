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
      const { postId, username } = action.payload;
      // Copy the posts array to modify it
      // A deep copy of the posts array might not be the best idea
      // Will look into this later
      const posts = JSON.parse(JSON.stringify(state.profile.posts));
      state.profile.posts.find((post, idx) => {
        // Increment the likes by one
        if (post.postId === postId) {
          posts[idx].likes.push(username);
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
