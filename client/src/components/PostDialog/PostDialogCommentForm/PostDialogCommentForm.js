import React, { useState, Fragment } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import axios from 'axios';

import {
  addComment,
  clearReplyCommentId
} from '../../../redux/posts/postsActions';

import Loader from '../../Loader/Loader';

const PostDialogCommentForm = ({
  currentPostId,
  token,
  addComment,
  clearReplyCommentId
}) => {
  const [comment, setComment] = useState({ fetching: false, data: '' });

  const postComment = async event => {
    event.preventDefault();
    if (!comment.data) return console.warn('Cannot post an empty comment.');
    setComment(previous => ({ ...previous, fetching: true }));
    try {
      const response = await axios.post(
        `/post/${currentPostId}/comment`,
        {
          comment: comment.data
        },
        {
          headers: {
            authorization: token
          }
        }
      );
      addComment(currentPostId, response.data.comment);
      clearReplyCommentId();
      setComment({ fetching: false, data: '' });

      // Scroll to bottom to see posted comments
      const comments = document.querySelector('.comments');
      comments.scrollTop = comments.scrollHeight;
    } catch (err) {
      console.warn(err.data);
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
  clearReplyCommentId: () => dispatch(clearReplyCommentId())
});

export default connect(null, mapDispatchToProps)(PostDialogCommentForm);
