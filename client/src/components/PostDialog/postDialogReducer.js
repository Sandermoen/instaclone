export const INITIAL_STATE = {
  fetching: true,
  error: false,
  replying: false,
  localStateComments: new Set(),
  data: {
    _id: null,
    image: '',
    caption: '',
    author: null,
    date: null,
    postVotes: [],
    comments: [],
    commentReplies: [],
  },
};

export const postDialogReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_POST_FAILURE': {
      return { ...state, fetching: false, error: action.payload };
    }
    case 'FETCH_POST_SUCCESS': {
      const { comments = [], commentCount = 0 } =
        action.payload.commentData || {};
      return {
        ...state,
        fetching: false,
        error: false,
        data: {
          ...action.payload,
          commentReplies: [],
          comments,
          commentCount,
        },
      };
    }
    case 'VOTE_POST': {
      const { currentUser, postId, dispatch } = action.payload;
      let postVotes = JSON.parse(JSON.stringify(state.data.postVotes));
      const liked = !!postVotes.find((vote) => vote.author === currentUser._id);
      if (!liked) {
        postVotes.push({ author: currentUser._id });
      } else {
        postVotes = postVotes.filter((vote) => vote.author !== currentUser._id);
      }
      dispatch &&
        dispatch({
          type: 'SET_POST_VOTES_COUNT',
          payload: { postId, votes: postVotes.length },
        });

      return {
        ...state,
        data: {
          ...state.data,
          postVotes,
        },
      };
    }
    case 'VOTE_COMMENT': {
      const { commentId, currentUser } = action.payload;
      const comments = JSON.parse(JSON.stringify(state.data.comments));
      const commentIndex = comments.findIndex(
        (comment) => comment._id === commentId
      );
      const liked = !!comments[commentIndex].commentVotes.find(
        (vote) => vote.author === currentUser._id
      );

      if (!liked) {
        comments[commentIndex].commentVotes.push({ author: currentUser._id });
      } else {
        comments[commentIndex].commentVotes = comments[
          commentIndex
        ].commentVotes.filter((vote) => vote.author !== currentUser._id);
      }

      return {
        ...state,
        data: {
          ...state.data,
          comments,
        },
      };
    }
    case 'ADD_COMMENT': {
      let comment = action.payload;
      let localStateComments = new Set(state.localStateComments);
      if (!Array.isArray(comment)) {
        localStateComments.add(comment._id);
        comment = [comment];
      }
      return {
        ...state,
        localStateComments,
        data: {
          ...state.data,
          comments: [...state.data.comments, ...comment],
        },
      };
    }
    case 'REMOVE_COMMENT': {
      const commentId = action.payload;
      const localStateComments = new Set(state.localStateComments);
      localStateComments.has(commentId) && localStateComments.delete(commentId);

      return {
        ...state,
        data: {
          ...state.data,
          localStateComments,
          comments: state.data.comments.filter(
            (comment) => comment._id !== commentId
          ),
          commentCount: state.data.commentCount - 1,
        },
      };
    }
    case 'ADD_COMMENT_REPLY': {
      let { comment: newComment, parentCommentId } = action.payload;
      const comments = JSON.parse(JSON.stringify(state.data.comments));
      const parentCommentIndex = comments.findIndex(
        (comment) => comment._id === parentCommentId
      );
      if (!Array.isArray(newComment)) {
        const parentComment = comments[parentCommentIndex];
        // Add a single comment object into an array
        // so we can spread it into the commentReplies array
        newComment = [newComment];
        parentComment.commentReplies = parentComment.commentReplies
          ? parentComment.commentReplies + 1
          : 1;
      }
      return {
        ...state,
        data: {
          ...state.data,
          comments,
          commentReplies: [...state.data.commentReplies, ...newComment],
        },
      };
    }
    case 'REMOVE_COMMENT_REPLY': {
      const { commentReplyId, parentCommentId } = action.payload;
      const comments = JSON.parse(JSON.stringify(state.data.comments));
      const commentIndex = comments.findIndex(
        (comment) => comment._id === parentCommentId
      );
      comments[commentIndex].commentReplies -= 1;

      return {
        ...state,
        data: {
          ...state.data,
          comments,
          commentReplies: state.data.commentReplies.filter(
            (commentReply) => commentReply._id !== commentReplyId
          ),
        },
      };
    }
    case 'VOTE_COMMENT_REPLY': {
      const { commentReplyId, currentUser } = action.payload;
      const commentReplies = JSON.parse(
        JSON.stringify(state.data.commentReplies)
      );
      const commentReplyIndex = state.data.commentReplies.findIndex(
        (commentReply) => commentReply._id === commentReplyId
      );
      const liked = !!commentReplies[commentReplyIndex].commentReplyVotes.find(
        (vote) => vote.author === currentUser._id
      );
      if (!liked) {
        commentReplies[commentReplyIndex].commentReplyVotes.push({
          author: currentUser._id,
        });
      } else {
        commentReplies[commentReplyIndex].commentReplyVotes = commentReplies[
          commentReplyIndex
        ].commentReplyVotes.filter((vote) => vote.author !== currentUser._id);
      }

      return {
        ...state,
        data: {
          ...state.data,
          commentReplies,
        },
      };
    }
    case 'SET_REPLYING': {
      const { username, commentId } = action.payload || {};
      if (username && commentId) {
        // Avoid re-rendering if commentId and commentUser are the same as previous state
        if (
          state.replying.commentId === commentId &&
          state.replying.commentUser === username
        ) {
          return state;
        }
        return { ...state, replying: { commentUser: username, commentId } };
      } else {
        return { ...state, replying: false };
      }
    }
    default: {
      throw new Error(
        `Invalid action type '${action.type}' passed to postDialogReducer.`
      );
    }
  }
};
