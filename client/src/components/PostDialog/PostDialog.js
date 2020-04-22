import React, {
  useEffect,
  useReducer,
  Fragment,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectToken, selectCurrentUser } from '../../redux/user/userSelectors';

import { showModal, hideModal } from '../../redux/modal/modalActions';

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
  username,
  token,
  currentUser,
  profileDispatch,
  showModal,
  hideModal,
}) => {
  const commentsRef = useRef();
  const [state, dispatch] = useReducer(postDialogReducer, INITIAL_STATE);

  useEffect(() => {
    try {
      (async function () {
        const response = await getPost(postId);
        dispatch({ type: 'FETCH_POST_SUCCESS', payload: response });
      })();
    } catch (err) {
      dispatch({ type: 'FETCH_POST_FAILURE', payload: err });
    }
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
      console.warn(err);
    }
  };

  const handleDeletePost = async () => {
    try {
      await deletePost(postId, token);
      profileDispatch({
        type: 'DELETE_POST',
        payload: postId,
      });
      hideModal('PostDialog');
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <div className="post-dialog" data-test="component-post-dialog">
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
            <Avatar
              className="avatar--small"
              imageSrc={state.data.author.avatar}
            />
          )}
          {state.fetching ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <SkeletonLoader style={{ height: '1rem', width: '10rem' }} />
              <SkeletonLoader
                style={{ height: '1rem', width: '15rem', marginTop: '5px' }}
              />
            </div>
          ) : (
            <p className="heading-4 heading-4--bold">
              <b>{username}</b>
            </p>
          )}
          {!state.fetching && (
            <div
              onClick={() =>
                showModal(
                  {
                    options:
                      currentUser.username === username
                        ? [
                            {
                              text: 'Go to post',
                            },
                            {
                              text: 'Copy link',
                            },
                            {
                              text: 'Delete post',
                              warning: true,
                              onClick: () => handleDeletePost(),
                            },
                          ]
                        : [{ text: 'Go to post' }, { text: 'Copy link' }],
                  },
                  'OptionsDialog'
                )
              }
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
                  username,
                }}
                caption
                currentUser={currentUser}
                token={token}
                post={state.data}
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
  username: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  currentUser: PropTypes.object.isRequired,
  profileDispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  token: selectToken,
  currentUser: selectCurrentUser,
});

const mapDispatchToProps = (dispatch) => ({
  showModal: (props, component) => dispatch(showModal(props, component)),
  hideModal: (component) => dispatch(hideModal(component)),
});

PostDialog.whyDidYouRender = true;

export default connect(mapStateToProps, mapDispatchToProps)(PostDialog);
