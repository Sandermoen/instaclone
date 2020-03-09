import React, { useState, Fragment } from 'react';
import axios from 'axios';

import Loader from '../../Loader/Loader';

const PostDialogCommentForm = ({
  currentPostId,
  token,
  setPost,
  setCurrentProfile
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
      // Update the comment array
      setPost(previous => {
        const comments = [...previous.data.comments];
        comments.unshift(response.data.comment);
        return { ...previous, data: { ...previous.data, comments } };
      });
      // Update the comment count
      setCurrentProfile(previous => {
        const posts = [...JSON.parse(JSON.stringify(previous.data.posts))];
        const postIndex = previous.data.posts.findIndex(
          post => post._id === currentPostId
        );
        posts[postIndex].commentsCount += 1;
        return { ...previous, data: { ...previous.data, posts } };
      });
      setComment({ fetching: false, data: '' });
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
        <h2 className="heading-3--button color-blue">Post</h2>
      </Fragment>
    </form>
  );
};

export default PostDialogCommentForm;
