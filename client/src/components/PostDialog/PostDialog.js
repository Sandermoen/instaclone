import React, { useEffect, useReducer, Fragment, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectToken, selectCurrentUser } from '../../redux/user/userSelectors';

import { getPost } from '../../services/postService';

import Avatar from '../Avatar/Avatar';
import Icon from '../Icon/Icon';
import Loader from '../Loader/Loader';
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
            <div style={{ cursor: 'pointer' }} className="post-dialog__more">
              <div className="icon icon--small">
                <Icon icon="ellipsis-horizontal" />
              </div>
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

PostDialog.whyDidYouRender = true;

export default connect(mapStateToProps)(PostDialog);
