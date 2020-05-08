import userTypes from './userTypes';

export const INITIAL_STATE = {
  currentUser: null,
  error: false,
  fetching: false,
  fetchingAvatar: false,
  updatingProfile: false,
  token: localStorage.getItem('token'),
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case userTypes.SIGN_UP_START:
    case userTypes.SIGN_IN_START: {
      return { ...state, error: false, fetching: true };
    }
    case userTypes.SIGN_IN_SUCCESS: {
      return {
        ...state,
        currentUser: action.payload.user,
        error: false,
        fetching: false,
        token: action.payload.token,
      };
    }
    case userTypes.SIGN_UP_FAILURE:
    case userTypes.SIGN_IN_FAILURE: {
      return {
        ...state,
        fetching: false,
        error: action.payload,
      };
    }
    case userTypes.SIGN_OUT: {
      return {
        ...state,
        currentUser: null,
        token: null,
      };
    }
    case userTypes.BOOKMARK_POST: {
      const { operation, postId } = action.payload;
      let bookmarks = JSON.parse(JSON.stringify(state.currentUser.bookmarks));
      if (operation === 'add') {
        bookmarks.push({ post: postId });
      } else {
        bookmarks = bookmarks.filter((bookmark) => bookmark.post !== postId);
      }
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          bookmarks,
        },
      };
    }
    case userTypes.REMOVE_AVATAR_START:
    case userTypes.CHANGE_AVATAR_START: {
      return { ...state, fetchingAvatar: true };
    }
    case userTypes.CHANGE_AVATAR_SUCCESS: {
      return {
        ...state,
        currentUser: { ...state.currentUser, avatar: action.payload },
        fetchingAvatar: false,
      };
    }
    case userTypes.REMOVE_AVATAR_FAILURE:
    case userTypes.CHANGE_AVATAR_FAILURE: {
      return {
        ...state,
        fetchingAvatar: false,
        error: action.payload,
      };
    }
    case userTypes.REMOVE_AVATAR_SUCCESS: {
      // Removing the avatar key from the currentUser object
      const { avatar, ...additionalKeys } = state.currentUser;
      return {
        ...state,
        currentUser: { ...additionalKeys },
        fetchingAvatar: false,
        error: false,
      };
    }
    case userTypes.UPDATE_PROFILE_START: {
      return {
        ...state,
        updatingProfile: true,
      };
    }
    case userTypes.UPDATE_PROFILE_SUCCESS: {
      return {
        ...state,
        error: false,
        updatingProfile: false,
        currentUser: { ...state.currentUser, ...action.payload },
      };
    }
    case userTypes.UPDATE_PROFILE_FAILURE: {
      return {
        ...state,
        updatingProfile: false,
        error: action.payload,
      };
    }
    default:
      return state;
  }
};

export default userReducer;
