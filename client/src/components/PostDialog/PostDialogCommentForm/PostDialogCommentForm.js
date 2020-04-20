import React, {
  useReducer,
  Fragment,
  useEffect,
  useRef,
  useCallback,
  useState,
} from 'react';
import PropTypes from 'prop-types';

import {
  createComment,
  createCommentReply,
} from '../../../services/commentService';

import {
  INITIAL_STATE,
  postDialogCommentFormReducer,
} from './postDialogCommentFormReducer';

import useSearchUsersDebounced from '../../../hooks/useSearchUsersDebounced';

import Loader from '../../Loader/Loader';
import SearchSuggestion from '../../SearchSuggestion/SearchSuggestion';

const PostDialogCommentForm = ({
  token,
  postId,
  commentsRef,
  dialogDispatch,
  profileDispatch,
  replying,
}) => {
  const [state, dispatch] = useReducer(
    postDialogCommentFormReducer,
    INITIAL_STATE
  );
  const [mention, setMention] = useState(null);

  let {
    handleSearchDebounced,
    result,
    setResult,
    fetching,
    setFetching,
  } = useSearchUsersDebounced();
  const handleSearchDebouncedMemoized = useCallback(
    (username, offset = 0) => handleSearchDebounced(username, offset),
    []
  );

  const commentInputRef = useRef();

  useEffect(() => {
    if (replying) {
      commentInputRef.current.value = `@${replying.commentUser} `;
      commentInputRef.current.focus();
    }
  }, [replying]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (state.comment.length === 0) {
      return dispatch({
        type: 'POST_COMMENT_FAILURE',
        payload: 'You cannot post an empty comment.',
      });
    }

    try {
      setResult(null);
      dispatch({ type: 'POST_COMMENT_START' });
      if (!replying) {
        // The user is not replying to a comment
        const comment = await createComment(state.comment, postId, token);
        dispatch({
          type: 'POST_COMMENT_SUCCESS',
          payload: { comment, dispatch: dialogDispatch, postId },
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
            parentCommentId: replying.commentId,
          },
        });
        dialogDispatch({ type: 'SET_REPLYING' });
      }
      // Increment the comment count on the overlay of the image on the profile page
      profileDispatch({
        type: 'INCREMENT_POST_COMMENTS_COUNT',
        payload: postId,
      });
    } catch (err) {
      dispatch({ type: 'POST_COMMENT_FAILURE', payload: err });
    }
  };

  return (
    <form
      onSubmit={(event) => handleSubmit(event)}
      className="post-dialog__add-comment"
      data-test="component-post-dialog-add-comment"
    >
      <Fragment>
        {state.posting && <Loader />}
        <input
          className="add-comment__input"
          type="text"
          placeholder="Add a comment..."
          onChange={(event) => {
            // Removed the `@username` from the input so the user is no longer looking to reply
            if (replying && !event.target.value) {
              dialogDispatch({ type: 'SET_REPLYING' });
            }
            dispatch({ type: 'SET_COMMENT', payload: event.target.value });
            // Checking for an @ mention
            let string = event.target.value.match(new RegExp(/@[a-zA-Z0-9]+$/));
            if (string) {
              setMention(() => {
                setFetching(true);
                const mention = string[0].substring(1);
                // Setting the result to an empty array to show skeleton
                setResult([]);
                handleSearchDebouncedMemoized(mention);
                return mention;
              });
            } else {
              setResult(null);
            }
          }}
          value={state.comment}
          ref={commentInputRef}
          data-test="component-add-comment-input"
        />
        <button
          type="submit"
          className="heading-3 heading--button font-bold color-blue"
        >
          Post
        </button>
      </Fragment>
      {result && (
        <SearchSuggestion
          fetching={fetching}
          result={result}
          username={mention}
          onClick={(user) => {
            let comment = commentInputRef.current.value;
            // Replace the last word with the @mention
            dispatch({
              type: 'SET_COMMENT',
              payload: comment.replace(/@\b(\w+)$/, `@${user.username} `),
            });
            commentInputRef.current.focus();
            setResult(null);
          }}
        />
      )}
    </form>
  );
};

PostDialogCommentForm.propTypes = {
  token: PropTypes.string.isRequired,
  postId: PropTypes.string.isRequired,
  commentsRef: PropTypes.object.isRequired,
  dialogDispatch: PropTypes.func.isRequired,
  profileDispatch: PropTypes.func.isRequired,
  replying: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).isRequired,
};

export default PostDialogCommentForm;
