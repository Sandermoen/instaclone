import React, { useReducer, Fragment, useEffect, useRef } from 'react';

import {
  createComment,
  createCommentReply
} from '../../../services/commentService';

import {
  INITIAL_STATE,
  postDialogCommentFormReducer
} from './postDialogCommentFormReducer';

import Loader from '../../Loader/Loader';

const PostDialogCommentForm = ({
  currentUser,
  token,
  postId,
  commentsRef,
  dialogDispatch,
  profileDispatch,
  replying
}) => {
  const [state, dispatch] = useReducer(
    postDialogCommentFormReducer,
    INITIAL_STATE
  );

  const commentInputRef = useRef();

  useEffect(() => {
    if (replying) {
      commentInputRef.current.value = `@${replying.commentUser} `;
      commentInputRef.current.focus();
    }
  }, [replying]);

  const handleSubmit = async event => {
    event.preventDefault();
    if (state.comment.length === 0) {
      return dispatch({
        type: 'POST_COMMENT_FAILURE',
        payload: 'You cannot post an empty comment.'
      });
    }

    try {
      dispatch({ type: 'POST_COMMENT_START' });
      if (!replying) {
        // The user is not replying to a comment
        const comment = await createComment(state.comment, postId, token);
        dispatch({
          type: 'POST_COMMENT_SUCCESS',
          payload: { comment, dispatch: dialogDispatch, postId }
        });
        // Scroll to bottom to see posted comment
        commentsRef.current.scrollTop = commentsRef.current.scrollHeight;
      } else {
        // The user is replying to a comment
        const comment = await createCommentReply(
          state.comment,
          replying.commentId,
          token
        );
        dispatch({
          type: 'POST_COMMENT_REPLY_SUCCESS',
          payload: {
            comment,
            dispatch: dialogDispatch,
            parentCommentId: replying.commentId
          }
        });
        dialogDispatch({ type: 'SET_REPLYING' });
      }
      // Increment the comment count on the overlay of the image on the profile page
      profileDispatch({
        type: 'INCREMENT_POST_COMMENTS_COUNT',
        payload: postId
      });
    } catch (err) {
      dispatch({ type: 'POST_COMMENT_FAILURE', payload: err });
    }
  };

  return (
    <form
      onSubmit={event => handleSubmit(event)}
      className="post-dialog__add-comment"
    >
      <Fragment>
        {state.posting && <Loader />}
        <input
          className="add-comment__input"
          type="text"
          placeholder="Add a comment..."
          onChange={event => {
            // Removed the `@username` from the input so the user is no longer looking to reply
            if (replying && !event.target.value) {
              dialogDispatch({ type: 'SET_REPLYING' });
            }
            dispatch({ type: 'SET_COMMENT', payload: event.target.value });
          }}
          value={state.comment}
          ref={commentInputRef}
        />
        <button
          type="submit"
          className="heading-3 heading--button font-bold color-blue"
        >
          Post
        </button>
      </Fragment>
    </form>
  );
};

export default PostDialogCommentForm;
