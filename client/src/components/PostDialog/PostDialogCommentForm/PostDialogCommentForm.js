import React, { useState, Fragment, useEffect, useRef } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import axios from 'axios';

import {
  addComment,
  clearReplyComment,
  toggleShowComments
} from '../../../redux/posts/postsActions';

import { selectReplyComment } from '../../../redux/posts/postsSelectors';

import Loader from '../../Loader/Loader';

const PostDialogCommentForm = ({
  currentPostId,
  token,
  addComment,
  clearReplyComment,
  replyComment,
  toggleShowComments
}) => {
  const [comment, setComment] = useState({ fetching: false, data: '' });
  const commentInput = useRef();

  useEffect(() => {
    if (replyComment) {
      setComment(previous => ({
        ...previous,
        data: `@${replyComment.username} `
      }));
      commentInput.current.focus();
    }
  }, [replyComment]);

  const postComment = async event => {
    event.preventDefault();
    if (!comment.data) return console.warn('Cannot post an empty comment.');
    setComment(previous => ({ ...previous, fetching: true }));
    try {
      const response = await axios.post(
        `/post/${
          replyComment ? replyComment.commentId : currentPostId
        }/comment`,
        {
          comment: comment.data,
          reply: replyComment ? true : false
        },
        {
          headers: {
            authorization: token
          }
        }
      );
      addComment(currentPostId, response.data.comment);
      if (replyComment && !replyComment.toggleComments) {
        toggleShowComments(currentPostId, replyComment.commentId);
      }
      clearReplyComment();
      setComment({ fetching: false, data: '' });

      if (!replyComment) {
        // Scroll to bottom to see posted comment
        const comments = document.querySelector('.comments');
        comments.scrollTop = comments.scrollHeight;
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <form
      onSubmit={event => postComment(event)}
      className="post-dialog__add-comment"
    >
      <Fragment>
        {comment.fetching && <Loader />}
        <input
          className="add-comment__input"
          type="text"
          placeholder="Add a comment..."
          onChange={event =>
            setComment({ fetching: false, data: event.target.value })
          }
          value={comment.data}
          ref={commentInput}
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

const mapDispatchToProps = dispatch => ({
  addComment: (postId, comment) => dispatch(addComment(postId, comment)),
  clearReplyComment: () => dispatch(clearReplyComment()),
  toggleShowComments: (postId, commentId) =>
    dispatch(toggleShowComments(postId, commentId))
});

const mapStateToProps = createStructuredSelector({
  replyComment: selectReplyComment
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostDialogCommentForm);
