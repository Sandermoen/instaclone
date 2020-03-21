import postsTypes from './postsTypes';

const INITIAL_STATE = {
  fetching: false,
  error: false,
  data: {},
  replyComment: undefined
};

const postsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case postsTypes.ADD_POSTS: {
      const posts = {};
      action.payload.map(post => (posts[post._id] = post));
      return { ...state, data: { ...state.data, ...posts } };
    }

    case postsTypes.FETCH_POST_DETAILS_START: {
      return { ...state, fetching: true, error: false };
    }

    case postsTypes.FETCH_POST_DETAILS_FAILURE: {
      return { ...state, fetching: false, error: action.payload };
    }

    case postsTypes.FETCH_POST_DETAILS_SUCCESS: {
      return { ...state, fetching: false, error: false };
    }

    case postsTypes.SET_POST_COMMENTS: {
      const { postId, comments } = action.payload;
      const post = JSON.parse(JSON.stringify(state.data[postId]));
      post.comments = comments;
      return {
        ...state,
        data: { ...state.data, [postId]: post }
      };
    }

    case postsTypes.SET_BOOKMARKED: {
      const { postId, bookmarked } = action.payload;
      const post = { ...state.data[postId] };
      post.bookmarked = bookmarked;
      return { ...state, data: { ...state.data, [postId]: post } };
    }

    case postsTypes.TOGGLE_BOOKMARK: {
      const postId = action.payload;
      const post = { ...state.data[postId] };
      post.bookmarked = !post.bookmarked;
      return { ...state, data: { ...state.data, [postId]: post } };
    }

    case postsTypes.VOTE_POST: {
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

    case postsTypes.VOTE_COMMENT: {
      const { postId, commentId, parentCommentId, response } = action.payload;
      const post = JSON.parse(JSON.stringify(state.data[postId]));
      let commentIndex = undefined;

      if (parentCommentId) {
        const parentCommentIndex = post.comments.findIndex(
          comment => comment._id === parentCommentId
        );

        commentIndex = post.comments[parentCommentIndex].replies.findIndex(
          comment => comment._id === commentId
        );
        post.comments[parentCommentIndex].replies[commentIndex].likes =
          response.likes;
        post.comments[parentCommentIndex].replies[commentIndex].likesCount =
          response.likesCount;
      } else {
        commentIndex = post.comments.findIndex(
          comment => comment._id === commentId
        );
        post.comments[commentIndex].likes = response.likes;
        post.comments[commentIndex].likesCount = response.likesCount;
      }
      return { ...state, data: { ...state.data, [postId]: post } };
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

    case postsTypes.DELETE_COMMENT: {
      const { postId, commentId, nestedCommentId } = action.payload;
      const post = JSON.parse(JSON.stringify(state.data[postId]));
      let commentsCount = 1;
      const commentIndex = post.comments.findIndex(
        comment => comment._id === commentId
      );
      const parentComment = post.comments[commentIndex];

      if (nestedCommentId) {
        const nestedCommentIndex = parentComment.replies.findIndex(
          comment => comment._id === nestedCommentId
        );
        parentComment.replies.splice(nestedCommentIndex, 1);
        parentComment.commentsCount -= 1;
      } else {
        commentsCount += parentComment.replies
          ? parentComment.replies.length
          : 0;
        post.comments.splice(commentIndex, 1);
      }

      post.commentsCount -= commentsCount;
      return { ...state, data: { ...state.data, [postId]: post } };
    }

    case postsTypes.ADD_COMMENT_REPLY: {
      const { postId, commentId, comment } = action.payload;
      const post = JSON.parse(JSON.stringify(state.data[postId]));
      let commentIndex = undefined;

      if (state.replyComment.nested) {
        commentIndex = post.comments.findIndex(
          comment => comment._id === state.replyComment.parentCommentId
        );
      } else {
        commentIndex = post.comments.findIndex(
          comment => comment._id === commentId
        );
      }

      const postComment = post.comments[commentIndex];
      post.commentsCount++;
      postComment.commentsCount++;

      postComment.replies
        ? postComment.replies.push(comment)
        : (postComment.replies = [comment]);
      return { ...state, data: { ...state.data, [postId]: post } };
    }

    case postsTypes.SET_COMMENT_REPLIES: {
      const { postId, commentId, comments } = action.payload;
      const post = JSON.parse(JSON.stringify(state.data[postId]));
      const commentIndex = post.comments.findIndex(
        comment => comment._id === commentId
      );
      post.comments[commentIndex].replies = comments;
      return { ...state, data: { ...state.data, [postId]: post } };
    }

    case postsTypes.SET_REPLY_COMMENT: {
      return {
        ...state,
        replyComment: { ...action.payload }
      };
    }

    case postsTypes.CLEAR_REPLY_COMMENT: {
      return { ...state, replyComment: undefined };
    }

    case postsTypes.TOGGLE_SHOW_COMMENTS: {
      const { postId, commentId } = action.payload;
      const post = JSON.parse(JSON.stringify(state.data[postId]));
      const commentIndex = post.comments.findIndex(
        comment => comment._id === commentId
      );
      const comment = post.comments[commentIndex];

      if (comment.hasOwnProperty('toggleComments')) {
        comment.toggleComments = !comment.toggleComments;
      } else {
        comment.toggleComments = true;
      }
      return {
        ...state,
        data: { ...state.data, [postId]: post }
      };
    }

    case postsTypes.CLEAR_POSTS: {
      return INITIAL_STATE;
    }

    default: {
      return state;
    }
  }
};

export default postsReducer;
