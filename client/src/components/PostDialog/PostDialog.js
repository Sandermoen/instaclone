import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import axios from 'axios';

import { selectToken, selectCurrentUser } from '../../redux/user/userSelectors';

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
  setCurrentProfile
}) => {
  const [post, setPost] = useState({ fetching: false, data: undefined });

  useEffect(() => {
    setPost({ fetching: true });
    axios
      .get(`/post/${currentPostId}`)
      .then(response => {
        const { caption, image, date, likes, comments, postId } = response.data;
        setPost({
          fetching: false,
          data: { caption, image, date, likes, comments, postId }
        });
      })
      .catch(err => setPost({ fetching: false }));
  }, [currentPostId]);

  return (
    <div className="post-dialog">
      {!post.data ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="post-dialog__image">
            <img src={post.data.image} alt="Post" />
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
                post.data.caption
                  ? {
                      message: post.data.caption,
                      avatar,
                      username
                    }
                  : null
              }
              comments={post.data.comments}
            />
            <PostDialogStats
              currentUser={currentUser}
              post={post}
              setCurrentProfile={setCurrentProfile}
              setPost={setPost}
              currentPostId={currentPostId}
              token={token}
            />
            <PostDialogCommentForm
              currentPostId={currentPostId}
              token={token}
              setPost={setPost}
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
  currentUser: selectCurrentUser
});

PostDialog.whyDidYouRender = true;

export default connect(mapStateToProps)(PostDialog);
