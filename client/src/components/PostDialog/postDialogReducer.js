export const INITIAL_STATE = {
  fetching: true,
  error: false,
  replying: false,
  data: {
    _id: null,
    image: '',
    caption: '',
    author: null,
    date: null,
    postVotes: [],
    comments: [],
    commentReplies: []
  }
};

export const postDialogReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_POST_FAILURE': {
      return { ...state, fetching: false, error: action.payload };
    }
    case 'FETCH_POST_SUCCESS': {
      return {
        ...state,
        fetching: false,
        error: false,
        data: { ...action.payload, commentReplies: [] }
      };
    }
    case 'VOTE_POST': {
      const { currentUser, postId, dispatch } = action.payload;
      let postVotes = JSON.parse(JSON.stringify(state.data.postVotes[0]));
      const liked = !!postVotes.votes.find(
        vote => vote.author === currentUser._id
      );
      if (!liked) {
        postVotes.votes.push({ author: currentUser._id });
      } else {
        postVotes.votes = postVotes.votes.filter(
          vote => vote.author !== currentUser._id
        );
      }
      dispatch({
        type: 'SET_POST_VOTES_COUNT',
        payload: { postId, votes: postVotes.votes.length }
      });

      return {
        ...state,
        data: {
          ...state.data,
          postVotes: [postVotes]
        }
      };
    }
    case 'VOTE_COMMENT': {
      const { commentId, currentUser } = action.payload;
      const comments = JSON.parse(JSON.stringify(state.data.comments));
      const commentIndex = comments.findIndex(
        comment => comment._id === commentId
      );
      const liked = !!comments[commentIndex].commentVotes.find(
        vote => vote.author === currentUser._id
      );

      if (!liked) {
        comments[commentIndex].commentVotes.push({ author: currentUser._id });
      } else {
        comments[commentIndex].commentVotes = comments[
          commentIndex
        ].commentVotes.filter(vote => vote.author !== currentUser._id);
      }

      return {
        ...state,
        data: {
          ...state.data,
          comments
        }
      };
    }
    case 'ADD_COMMENT': {
      const comment = action.payload;

      return {
        ...state,
        data: {
          ...state.data,
          comments: [...state.data.comments, comment]
        }
      };
    }
    case 'REMOVE_COMMENT': {
      const commentId = action.payload;

      return {
        ...state,
        data: {
          ...state.data,
          comments: state.data.comments.filter(
            comment => comment._id !== commentId
          )
        }
      };
    }
    case 'ADD_COMMENT_REPLY': {
      let { comment: newComment, parentCommentId } = action.payload;
      const comments = JSON.parse(JSON.stringify(state.data.comments));
      const parentCommentIndex = comments.findIndex(
        comment => comment._id === parentCommentId
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
          commentReplies: [...state.data.commentReplies, ...newComment]
        }
      };
    }
    case 'REMOVE_COMMENT_REPLY': {
      const { commentReplyId, parentCommentId } = action.payload;
      const comments = JSON.parse(JSON.stringify(state.data.comments));
      const commentIndex = comments.findIndex(
        comment => comment._id === parentCommentId
      );
      comments[commentIndex].commentReplies -= 1;

      return {
        ...state,
        data: {
          ...state.data,
          comments,
          commentReplies: state.data.commentReplies.filter(
            commentReply => commentReply._id !== commentReplyId
          )
        }
      };
    }
    case 'VOTE_COMMENT_REPLY': {
      const { commentReplyId, currentUser } = action.payload;
      const commentReplies = JSON.parse(
        JSON.stringify(state.data.commentReplies)
      );
      const commentReplyIndex = state.data.commentReplies.findIndex(
        commentReply => commentReply._id === commentReplyId
      );
      const liked = !!commentReplies[commentReplyIndex].commentReplyVotes.find(
        vote => vote.author === currentUser._id
      );
      if (!liked) {
        commentReplies[commentReplyIndex].commentReplyVotes.push({
          author: currentUser._id
        });
      } else {
        commentReplies[commentReplyIndex].commentReplyVotes = commentReplies[
          commentReplyIndex
        ].commentReplyVotes.filter(vote => vote.author !== currentUser._id);
      }

      return {
        ...state,
        data: {
          ...state.data,
          commentReplies
        }
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
