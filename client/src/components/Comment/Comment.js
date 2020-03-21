import React, { Fragment, useEffect, useRef } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { formatDate } from '../../utils/timeUtils';

import Icon from '../Icon/Icon';

import {
  setReplyComment,
  fetchCommentReplies,
  toggleShowComments,
  voteComment,
  deleteComment
} from '../../redux/posts/postsActions';

import { showModal } from '../../redux/modal/modalActions';

import { selectToken, selectCurrentUser } from '../../redux/user/userSelectors';

import Avatar from '../Avatar/Avatar';
import PulsatingIcon from '../Icon/PulsatingIcon/PulsatingIcon';

const Comment = ({
  avatar,
  comment,
  username,
  caption,
  setReplyComment,
  post,
  fetchCommentReplies,
  toggleShowComments,
  token,
  voteComment,
  currentUser,
  showModal,
  deleteComment
}) => {
  useEffect(() => {
    if (comment.toggleComments === true) {
      fetchCommentReplies(post._id, comment._id);
    }
  }, [comment, fetchCommentReplies, post]);

  const commentRef = useRef();

  const renderComment = (
    avatar,
    comment,
    username,
    reply,
    caption,
    key,
    nested
  ) => (
    <div
      style={reply ? { marginLeft: '5rem' } : {}}
      className="comment"
      key={key}
      ref={commentRef}
    >
      <Avatar imageSrc={avatar} className="avatar--small" />
      <div className="comment__content">
        <p className="heading-4">
          <b>{username}</b> {comment.message}
        </p>
        {!caption && comment.username === currentUser.username ? (
          <div
            className="comment__menu-dots"
            style={{ marginRight: '0' }}
            onClick={event => {
              event.nativeEvent.stopImmediatePropagation();
              showModal(
                {
                  options: [
                    {
                      warning: true,
                      text: 'Delete',
                      onClick: () =>
                        deleteComment(
                          post._id,
                          nested ? comment.postId : comment._id,
                          nested ? comment._id : null,
                          token
                        )
                    }
                  ]
                },
                'OptionsDialog'
              );
            }}
          >
            <Icon
              className="icon--small icon--button color-grey"
              icon="ellipsis-horizontal"
              style={{ height: '3rem' }}
            />
          </div>
        ) : null}
        <div className="comment__stats">
          <p className="heading-5 color-light">
            {formatDate(comment.date ? comment.date : post.date)}
          </p>
          {!caption && (
            <Fragment>
              {comment.likesCount > 0 && (
                <p className="heading-5 color-light">
                  {comment.likesCount}{' '}
                  {comment.likesCount === 1 ? 'like' : 'likes'}
                </p>
              )}
              <button
                onClick={() => {
                  setReplyComment(
                    comment._id,
                    username,
                    comment._id ? comment.toggleComments : true,
                    nested ? true : false,
                    comment.postId
                  );
                }}
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
          <PulsatingIcon
            toggle={comment.likes.includes(currentUser.username)}
            constantProps={{
              onClick: () =>
                voteComment(
                  post._id,
                  comment._id,
                  reply ? comment.postId : null,
                  token
                )
            }}
            toggledProps={[
              { icon: 'heart', className: 'icon--tiny color-red' },
              { icon: 'heart-outline', className: 'icon--tiny' }
            ]}
            elementRef={commentRef}
          />
        </div>
      )}
    </div>
  );

  return (
    <Fragment>
      {renderComment(avatar, comment, username, false, caption, comment._id)}
      {comment.replies && comment.toggleComments
        ? comment.replies.map(commentReply =>
            renderComment(
              commentReply.avatar,
              commentReply,
              commentReply.username,
              true,
              false,
              commentReply._id,
              true
            )
          )
        : null}
    </Fragment>
  );
};

const mapDispatchToProps = dispatch => ({
  setReplyComment: (
    commentId,
    username,
    showComments,
    nested,
    parentCommentId
  ) =>
    dispatch(
      setReplyComment(
        commentId,
        username,
        showComments,
        nested,
        parentCommentId
      )
    ),
  fetchCommentReplies: (postId, commentId) =>
    dispatch(fetchCommentReplies(postId, commentId)),
  toggleShowComments: (postId, commentId) =>
    dispatch(toggleShowComments(postId, commentId)),
  voteComment: (postId, commentId, parentCommentId, authToken) =>
    dispatch(voteComment(postId, commentId, parentCommentId, authToken)),
  showModal: (props, component) => dispatch(showModal(props, component)),
  deleteComment: (postId, commentId, nestedCommentId, authToken) =>
    dispatch(deleteComment(postId, commentId, nestedCommentId, authToken))
});

const mapStateToProps = createStructuredSelector({
  token: selectToken,
  currentUser: selectCurrentUser
});

export default connect(mapStateToProps, mapDispatchToProps)(Comment);
