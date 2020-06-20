import React, { Fragment, useRef, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { formatDateDistance } from '../../utils/timeUtils';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import Linkify from 'linkifyjs/react';
import * as linkify from 'linkifyjs';
import mention from 'linkifyjs/plugins/mention';
import hashtag from 'linkifyjs/plugins/hashtag';

import { linkifyOptions } from '../../utils/linkifyUtils';

import Icon from '../Icon/Icon';

import { showModal, hideModal } from '../../redux/modal/modalActions';
import { showAlert } from '../../redux/alert/alertActions';

import {
  voteComment,
  getCommentReplies,
  deleteComment,
} from '../../services/commentService';

import Avatar from '../Avatar/Avatar';
import PulsatingIcon from '../Icon/PulsatingIcon/PulsatingIcon';
import CommentReply from './CommentReply/CommentReply';

mention(linkify);
hashtag(linkify);

const Comment = ({
  comment,
  caption,
  simple,
  post,
  token,
  currentUser,
  dialogDispatch,
  profileDispatch,
  showModal,
  hideModal,
  showAlert,
}) => {
  const commentRef = useRef();
  const [commentPostTime, setCommentPostTime] = useState(() =>
    formatDateDistance(caption ? post.date : comment.date)
  );
  const [toggleCommentReplies, setToggleCommentReplies] = useState(false);
  const author = caption ? comment : comment.author;

  const commentReplies =
    post.commentReplies
      .filter((commentReply) => commentReply.parentComment === comment._id)
      .sort((a, b) => {
        return new Date(a) - new Date(b);
      }) || [];

  useEffect(() => {
    const commentPostTimeInterval = setInterval(() => {
      setCommentPostTime(
        formatDateDistance(caption ? post.date : comment.date)
      );
    }, 60000);
    return () => clearInterval(commentPostTimeInterval);
  }, [setCommentPostTime, caption, comment, post]);

  const handleVote = async () => {
    try {
      dialogDispatch &&
        dialogDispatch({
          type: 'VOTE_COMMENT',
          payload: { commentId: comment._id, currentUser },
        });
      await voteComment(comment._id, token);
    } catch (err) {
      showAlert('Could not vote on the comment.', () => handleVote());
    }
  };

  const handleGetCommentReplies = async () => {
    if (commentReplies.length === comment.commentReplies) {
      setToggleCommentReplies((previous) => !previous);
    } else {
      try {
        const replies = await getCommentReplies(
          comment._id,
          commentReplies.length > 0 ? commentReplies.length : 0
        );
        dialogDispatch({
          type: 'ADD_COMMENT_REPLY',
          payload: { comment: replies, parentCommentId: comment._id },
        });
        !toggleCommentReplies && setToggleCommentReplies(true);
      } catch (err) {
        showAlert("Could not get the comment's replies.", () =>
          handleGetCommentReplies()
        );
      }
    }
  };

  const handleDeleteComment = async () => {
    try {
      dialogDispatch({ type: 'REMOVE_COMMENT', payload: comment._id });
      profileDispatch &&
        profileDispatch({
          type: 'DECREMENT_POST_COMMENTS_COUNT',
          payload: {
            decrementCount: comment.commentReplies
              ? 1 + comment.commentReplies
              : 1,
            postId: post._id,
          },
        });
      await deleteComment(comment._id, token);
    } catch (err) {
      showAlert('Could not delete comment.', () => handleDeleteComment());
    }
  };

  const renderToggleRepliesButtonText = () => {
    if (commentReplies.length === comment.commentReplies) {
      if (toggleCommentReplies) {
        return 'Hide replies';
      }
      return `View replies (${comment.commentReplies})`;
    } else if (commentReplies.length < comment.commentReplies) {
      return `View replies (${comment.commentReplies - commentReplies.length})`;
    }
  };

  const commentClassNames = classNames({
    comment: true,
    'comment--simple': simple,
  });

  return (
    <Fragment>
      <div className={commentClassNames} ref={commentRef}>
        <Link
          onClick={() => hideModal('PostDialog')}
          to={`/${author.username}`}
        >
          <Avatar
            size="4rem"
            imageSrc={author.avatar}
            className="avatar--small"
          />
        </Link>
        <div className="comment__content">
          <p className="heading-4">
            <Link
              onClick={() => hideModal('PostDialog')}
              style={{
                textDecoration: 'none',
                color: 'currentColor',
                marginRight: '5px',
              }}
              to={`/${author.username}`}
            >
              <b>{author.username}</b>
            </Link>
            <Linkify options={linkifyOptions}>{comment.message}</Linkify>
          </p>
          {!caption &&
          currentUser &&
          author.username === currentUser.username ? (
            <div
              onClick={() =>
                showModal(
                  {
                    options: [
                      {
                        warning: true,
                        text: 'Delete',
                        onClick: () => handleDeleteComment(),
                      },
                    ],
                  },
                  'OptionsDialog/OptionsDialog'
                )
              }
              className="comment__menu-dots"
              style={{ marginRight: '0' }}
            >
              <Icon
                className="icon--small icon--button color-grey"
                icon="ellipsis-horizontal"
                style={{ height: '3rem' }}
              />
            </div>
          ) : null}
          <div className="comment__stats">
            <p className="heading-5 color-light">{commentPostTime}</p>
            {!caption && (
              <Fragment>
                {comment.commentVotes.length > 0 && (
                  <p className="heading-5 color-light">
                    {comment.commentVotes.length}{' '}
                    {comment.commentVotes.length === 1 ? 'like' : 'likes'}
                  </p>
                )}
                <button
                  onClick={() =>
                    // Telling the PostDialogCommentForm that we want to reply to this comment
                    dialogDispatch({
                      type: 'SET_REPLYING',
                      payload: {
                        username: comment.author.username,
                        commentId: comment._id,
                      },
                    })
                  }
                  className="heading-5 heading--button color-light"
                >
                  reply
                </button>
              </Fragment>
            )}
          </div>
          {caption && post.commentData ? (
            <Link
              className="heading-4 color-grey font-medium"
              style={{ textDecoration: 'none' }}
              to={`/post/${post._id}`}
            >
              View all {post.commentData.commentCount} comments
            </Link>
          ) : null}
          {dialogDispatch && !caption && comment.commentReplies > 0 ? (
            <p
              onClick={() => handleGetCommentReplies()}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '1rem',
              }}
              className="heading-5 heading--button color-light"
            >
              <span className="dash mr-lg" />
              {/* Check if all the comments available are fetched */}
              {renderToggleRepliesButtonText()}
            </p>
          ) : null}
        </div>
        {!caption && (
          <div className="comment__like">
            {currentUser ? (
              <PulsatingIcon
                toggle={
                  !!comment.commentVotes.find(
                    (vote) => vote.author === currentUser._id
                  )
                }
                constantProps={{
                  onClick: () => handleVote(),
                }}
                toggledProps={[
                  { icon: 'heart', className: 'icon--tiny color-red' },
                  { icon: 'heart-outline', className: 'icon--tiny' },
                ]}
                elementRef={commentRef}
              />
            ) : (
              <Icon icon="heart-outline" className="icon--tiny" />
            )}
          </div>
        )}
      </div>
      {/* Render any comment replies */}
      {toggleCommentReplies
        ? commentReplies.map((commentReply, idx) => (
            <CommentReply
              comment={commentReply}
              parentComment={comment}
              post={post}
              token={token}
              currentUser={currentUser}
              dialogDispatch={dialogDispatch}
              profileDispatch={profileDispatch}
              showModal={showModal}
              hideModal={hideModal}
              showAlert={showAlert}
              key={idx}
            />
          ))
        : null}
    </Fragment>
  );
};

const mapDispatchToProps = (dispatch) => ({
  hideModal: (component) => dispatch(hideModal(component)),
  showModal: (props, component) => dispatch(showModal(props, component)),
  showAlert: (text, onClick) => dispatch(showAlert(text, onClick)),
});

Comment.propTypes = {
  comment: PropTypes.shape({
    message: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    username: PropTypes.isRequired,
    commentVotes: PropTypes.array,
    _id: PropTypes.string,
    date: PropTypes.string,
  }).isRequired,
  caption: PropTypes.bool,
  post: PropTypes.object.isRequired,
  token: PropTypes.string,
  currentUser: PropTypes.object,
  showModal: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(Comment);
