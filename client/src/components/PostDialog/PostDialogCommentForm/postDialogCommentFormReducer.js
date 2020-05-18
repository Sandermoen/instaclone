export const INITIAL_STATE = {
  posting: false,
  error: false,
  comment: '',
};

export const postDialogCommentFormReducer = (state, action) => {
  switch (action.type) {
    case 'POST_COMMENT_START': {
      return { ...state, posting: true };
    }
    case 'POST_COMMENT_FAILURE': {
      return { ...state, posting: false, error: action.payload };
    }
    case 'POST_COMMENT_SUCCESS': {
      const { comment, dispatch } = action.payload;
      dispatch && dispatch({ type: 'ADD_COMMENT', payload: comment });
      return INITIAL_STATE;
    }
    case 'POST_COMMENT_REPLY_SUCCESS': {
      const { comment, dispatch, parentCommentId } = action.payload;
      dispatch &&
        dispatch({
          type: 'ADD_COMMENT_REPLY',
          payload: { comment, parentCommentId },
        });
      return INITIAL_STATE;
    }
    case 'SET_COMMENT': {
      return { ...state, comment: action.payload };
    }
    default: {
      throw new Error(
        `Invalid action type '${action.type}' passed to postDialogCommentFormReducer.`
      );
    }
  }
};
