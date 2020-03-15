import React, { useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectToken, selectCurrentUser } from '../../redux/user/userSelectors';
import { selectPost } from '../../redux/posts/postsSelectors';

import { fetchPostComments } from '../../redux/posts/postsActions';

import Avatar from '../Avatar/Avatar';
import Icon from '../Icon/Icon';
import Loader from '../Loader/Loader';
import Comments from '../Comments/Comments';
import PostDialogCommentForm from './PostDialogCommentForm/PostDialogCommentForm';
import PostDialogStats from './PostDialogStats/PostDialogStats';

const PostDialog = ({
  currentPostId,
  avatar = require('../../assets/img/default-avatar.png'),
  username,
  token,
  currentUser,
  setCurrentProfile,
  post,
  fetchPostComments
}) => {
  useEffect(() => {
    fetchPostComments(currentPostId);
  }, [currentPostId, fetchPostComments]);

  return (
    <div className="post-dialog">
      {!post.comments ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="post-dialog__image">
            <img src={post.image} alt="Post" />
          </div>
          <div className="post-dialog__content">
            <header className="post-dialog__header">
              <Avatar className="avatar--small" imageSrc={avatar} />
              <p className="heading-4 heading-4--bold">
                <b>{username}</b>
              </p>
              <div style={{ cursor: 'pointer' }} className="post-dialog__more">
                <div className="icon icon--small">
                  <Icon icon="ellipsis-horizontal" />
                </div>
              </div>
            </header>
            <Comments
              caption={
                post.caption
                  ? {
                      message: post.caption,
                      avatar,
                      username
                    }
                  : null
              }
              comments={post.comments}
              post={post}
            />
            <PostDialogStats
              currentUser={currentUser}
              post={post}
              setCurrentProfile={setCurrentProfile}
              currentPostId={currentPostId}
              token={token}
            />
            <PostDialogCommentForm
              currentPostId={currentPostId}
              token={token}
              setCurrentProfile={setCurrentProfile}
            />
          </div>
        </Fragment>
      )}
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  token: selectToken,
  currentUser: selectCurrentUser,
  post: selectPost
});

const mapDispatchToProps = dispatch => ({
  fetchPostComments: postId => dispatch(fetchPostComments(postId))
});

PostDialog.whyDidYouRender = true;

export default connect(mapStateToProps, mapDispatchToProps)(PostDialog);
