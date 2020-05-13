import React, { useEffect, useReducer, Fragment, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import classNames from 'classnames';
import { Link, useHistory } from 'react-router-dom';

import { selectToken, selectCurrentUser } from '../../redux/user/userSelectors';

import { showModal, hideModal } from '../../redux/modal/modalActions';
import { showAlert } from '../../redux/alert/alertActions';

import { getPost, deletePost } from '../../services/postService';
import { getComments } from '../../services/commentService';

import Avatar from '../Avatar/Avatar';
import Icon from '../Icon/Icon';
import SkeletonLoader from '../SkeletonLoader/SkeletonLoader';
import Comment from '../Comment/Comment';
import PostDialogCommentForm from './PostDialogCommentForm/PostDialogCommentForm';
import PostDialogStats from './PostDialogStats/PostDialogStats';

import { INITIAL_STATE, postDialogReducer } from './postDialogReducer';

const PostDialog = ({
  postId,
  token,
  currentUser,
  profileDispatch,
  showModal,
  hideModal,
  showAlert,
  style,
  className,
}) => {
  const commentsRef = useRef();
  const [state, dispatch] = useReducer(postDialogReducer, INITIAL_STATE);
  const history = useHistory();

  useEffect(() => {
    window.history.pushState(
      { prevUrl: window.location.href },
      null,
      `/post/${postId}`
    );
    (async function () {
      try {
        const response = await getPost(postId);
        dispatch({ type: 'FETCH_POST_SUCCESS', payload: response });
      } catch (err) {
        history.push('/');
        dispatch({ type: 'FETCH_POST_FAILURE', payload: err });
      }
    })();
    return () =>
      window.history.pushState(
        'profile',
        'Profile',
        window.history.state.prevUrl
      );
  }, [postId]);

  const fetchAdditionalComments = async () => {
    try {
      const commentData = await getComments(
        postId,
        state.data.comments.length,
        state.localStateComments.size
      );
      dispatch({ type: 'ADD_COMMENT', payload: commentData.comments });
    } catch (err) {
      showAlert('Unable to fetch additional comments.', () =>
        fetchAdditionalComments()
      );
    }
  };

  const handleDeletePost = async () => {
    try {
      await deletePost(postId, token);
      profileDispatch
        ? profileDispatch({
            type: 'DELETE_POST',
            payload: postId,
          })
        : history.push(`/${state.data.author.username}`);
      hideModal('PostDialog');
    } catch (err) {
      showAlert('Unable to delete post.', () => handleDeletePost());
    }
  };

  const postDialogClassNames = classNames({
    'post-dialog': true,
    [className]: className,
  });

  return (
    <div
      className={postDialogClassNames}
      data-test="component-post-dialog"
      style={style}
    >
      <Fragment>
        <div className="post-dialog__image">
          {state.fetching ? (
            <SkeletonLoader animated />
          ) : (
            <img src={state.data.image} alt="Post" />
          )}
        </div>
        <header className="post-dialog__header">
          {state.fetching ? (
            <SkeletonLoader
              style={{ height: '4rem', width: '4rem', borderRadius: '100px' }}
            />
          ) : (
            <Link
              to={`/${state.data.author.username}`}
              style={{ display: 'flex' }}
            >
              <Avatar
                className="avatar--small"
                imageSrc={state.data.author.avatar}
              />
            </Link>
          )}
          {state.fetching ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <SkeletonLoader style={{ height: '1rem', width: '10rem' }} />
              <SkeletonLoader
                style={{ height: '1rem', width: '15rem', marginTop: '5px' }}
              />
            </div>
          ) : (
            <Link
              style={{ textDecoration: 'none' }}
              to={`/${state.data.author.username}`}
            >
              <p className="heading-4 heading-4--bold">
                <b>{state.data.author.username}</b>
              </p>
            </Link>
          )}
          {!state.fetching && (
            <div
              onClick={() => {
                const options = [
                  {
                    text: 'Go to post',
                    onClick: () => {
                      hideModal('PostDialog');
                      history.push(`/post/${postId}`);
                    },
                  },
                  {
                    text: 'Copy link',
                    onClick: () => {
                      navigator.clipboard
                        .writeText(document.URL)
                        .then(() => showAlert('Link copied to clipboard.'))
                        .catch(() =>
                          showAlert('Could not copy link to clipboard.')
                        );
                    },
                  },
                ];
                showModal(
                  {
                    options:
                      currentUser &&
                      currentUser.username === state.data.author.username
                        ? [
                            ...options,
                            {
                              text: 'Delete post',
                              warning: true,
                              onClick: () => handleDeletePost(),
                            },
                          ]
                        : options,
                  },
                  'OptionsDialog'
                );
              }}
              style={{ cursor: 'pointer' }}
              className="post-dialog__more"
            >
              <Icon className="icon--small" icon="ellipsis-horizontal" />
            </div>
          )}
        </header>
        <div
          data-test="component-post-dialog-content"
          className="post-dialog__content"
        >
          <div ref={commentsRef} className="comments">
            {/* Render a caption if there is one as a Comment component with the caption prop */}
            {state.data.caption && !state.fetching ? (
              <Comment
                comment={{
                  message: state.data.caption,
                  avatar: state.data.author.avatar,
                  username: state.data.author.username,
                }}
                currentUser={currentUser}
                token={token}
                post={state.data}
                caption
              />
            ) : null}
            {!state.fetching &&
              state.data.comments.map((comment, idx) => (
                <Comment
                  comment={comment}
                  currentUser={currentUser}
                  token={token}
                  post={state.data}
                  key={idx}
                  dialogDispatch={dispatch}
                  profileDispatch={profileDispatch}
                />
              ))}
            {state.data.comments.length - state.localStateComments.size <
              state.data.commentCount - state.localStateComments.size && (
              <div
                style={{ padding: '2rem', cursor: 'pointer' }}
                onClick={() => fetchAdditionalComments()}
              >
                <Icon
                  style={{
                    margin: '0 auto',
                  }}
                  icon="add-circle-outline"
                />
              </div>
            )}
          </div>
          {state.fetching ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '2rem 2rem 6rem 2rem',
              }}
            >
              <SkeletonLoader style={{ height: '1.5rem', width: '15rem' }} />
              <SkeletonLoader
                style={{ height: '1.5rem', width: '20rem', marginTop: '1rem' }}
              />
              <SkeletonLoader
                style={{ height: '1.5rem', width: '10rem', marginTop: '1rem' }}
              />
            </div>
          ) : (
            <PostDialogStats
              currentUser={currentUser}
              token={token}
              post={state.data}
              dispatch={dispatch}
              profileDispatch={profileDispatch}
            />
          )}
          {!state.fetching && (
            <PostDialogCommentForm
              postId={postId}
              token={token}
              commentsRef={commentsRef}
              dialogDispatch={dispatch}
              profileDispatch={profileDispatch}
              replying={state.replying}
            />
          )}
        </div>
      </Fragment>
    </div>
  );
};

PostDialog.propTypes = {
  postId: PropTypes.string.isRequired,
  token: PropTypes.string,
  currentUser: PropTypes.object,
  profileDispatch: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  token: selectToken,
  currentUser: selectCurrentUser,
});

const mapDispatchToProps = (dispatch) => ({
  showModal: (props, component) => dispatch(showModal(props, component)),
  hideModal: (component) => dispatch(hideModal(component)),
  showAlert: (text, onClick) => dispatch(showAlert(text, onClick)),
});

PostDialog.whyDidYouRender = true;

export default connect(mapStateToProps, mapDispatchToProps)(PostDialog);
