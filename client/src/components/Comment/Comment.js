import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';

import {
  setReplyComment,
  fetchCommentReplies,
  toggleShowComments
} from '../../redux/posts/postsActions';

import Avatar from '../Avatar/Avatar';
import Icon from '../Icon/Icon';

const Comment = ({
  avatar,
  comment,
  username,
  caption,
  setReplyComment,
  post,
  fetchCommentReplies,
  toggleShowComments
}) => {
  useEffect(() => {
    if (comment.toggleComments === true) {
      fetchCommentReplies(post._id, comment._id);
    }
  }, [comment]);

  const renderComment = (avatar, comment, username, reply, caption, key) => (
    <div
      style={reply ? { marginLeft: '5rem' } : {}}
      className="comment"
      key={key}
    >
      <Avatar imageSrc={avatar} className="avatar--small" />
      <div className="comment__content">
        <p className="heading-4">
          <b>{username}</b> {comment.message}
        </p>
        <div className="comment__stats">
          <p className="heading-5 color-light">4 d</p>
          {!caption && (
            <Fragment>
              <p className="heading-5 color-light">10 likes</p>
              <button
                onClick={() =>
                  setReplyComment(comment._id, username, comment.toggleComments)
                }
                className="heading-5 heading--button color-light"
              >
                reply
              </button>
            </Fragment>
          )}
        </div>
        {!caption && comment.commentsCount ? (
          <p
            onClick={() => toggleShowComments(post._id, comment._id)}
            style={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}
            className="heading-5 heading--button color-light"
          >
            <span className="dash mr-lg" />
            {comment.toggleComments
              ? 'Hide replies'
              : `View replies (${comment.commentsCount})`}
          </p>
        ) : null}
      </div>
      {!caption && (
        <div className="comment__like">
          <Icon icon="heart-outline" className="icon--tiny" />
        </div>
      )}
    </div>
  );

  return (
    <Fragment>
      {renderComment(avatar, comment, username, false, caption, comment._id)}
      {comment.replies && comment.toggleComments
        ? comment.replies.map(
            ({ message, commentsCount, avatar, username, _id }) =>
              renderComment(
                avatar,
                { message, commentsCount },
                username,
                true,
                false,
                _id
              )
          )
        : null}
    </Fragment>
  );
};

const mapDispatchToProps = dispatch => ({
  setReplyComment: (commentId, username, showComments) =>
    dispatch(setReplyComment(commentId, username, showComments)),
  fetchCommentReplies: (postId, commentId) =>
    dispatch(fetchCommentReplies(postId, commentId)),
  toggleShowComments: (postId, commentId) =>
    dispatch(toggleShowComments(postId, commentId))
});

export default connect(null, mapDispatchToProps)(Comment);
