import postsTypes from './postsTypes';

const INITIAL_STATE = {
  fetching: false,
  error: false,
  data: {},
  replyId: undefined
};

const postsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case postsTypes.ADD_POSTS: {
      const posts = {};
      action.payload.map(post => (posts[post._id] = post));
      return { ...state, data: { ...state.data, ...posts } };
    }
    case postsTypes.FETCH_POST_COMMENTS_START: {
      return { ...state, fetching: true, error: false };
    }
    case postsTypes.FETCH_POST_COMMENTS_SUCCESS: {
      const { postId, comments } = action.payload;
      const post = JSON.parse(JSON.stringify(state.data[postId]));
      post.comments = comments;
      return {
        ...state,
        fetching: false,
        error: false,
        data: { ...state.data, [postId]: post }
      };
    }
    case postsTypes.FETCH_POST_COMMENTS_FAILURE: {
      return { ...state, fetching: false, error: action.payload };
    }
    case postsTypes.LIKE_POST: {
      const { postId, response } = action.payload;
      const post = JSON.parse(JSON.stringify(state.data[postId]));
      post.likes = response.likes;
      post.likesCount = response.likesCount;
      return {
        ...state,
        data: {
          ...state.data,
          [postId]: post
        }
      };
    }
    case postsTypes.ADD_COMMENT: {
      const { postId, comment } = action.payload;
      const post = JSON.parse(JSON.stringify(state.data[postId]));
      post.comments.push(comment);
      post.commentsCount++;
      return {
        ...state,
        data: {
          ...state.data,
          [postId]: post
        }
      };
    }
    case postsTypes.SET_REPLY_ID: {
      return { ...state, replyId: action.payload };
    }
    case postsTypes.CLEAR_REPLY_ID: {
      return { ...state, replyId: undefined };
    }
    default: {
      return state;
    }
  }
};

export default postsReducer;
