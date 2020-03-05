import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import axios from 'axios';

import { selectToken, selectCurrentUser } from '../../redux/user/userSelectors';

import Avatar from '../Avatar/Avatar';
import Comment from '../Comment/Comment';
import Icon from '../Icon/Icon';
import Loader from '../Loader/Loader';

const PostDialog = ({
  currentPostId,
  avatar = require('../../assets/img/default-avatar.png'),
  username,
  token,
  currentUser,
  setCurrentProfile
}) => {
  const [post, setPost] = useState({ fetching: false, data: undefined });
  const likeImage = async event => {
    event.nativeEvent.stopImmediatePropagation();
    try {
      const response = await axios.post(`/post/${currentPostId}/vote`, null, {
        headers: {
          authorization: token
        }
      });
      setPost(previous => ({
        ...previous,
        data: { ...previous.data, likes: response.data.likes }
      }));
      setCurrentProfile(previous => {
        const posts = previous.data.posts;
        const postIndex = posts.findIndex(
          post => post.postId === currentPostId
        );
        posts[postIndex].likesCount = response.data.likes.length;
        return { ...previous, data: { ...previous.data, posts } };
      });
    } catch (err) {
      console.warn(err.data);
    }
  };

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
  }, []);

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
            {/* These will be converted to their own components */}
            <div className="comments">
              <Comment
                avatar={avatar}
                comment={post.data.caption}
                username={username}
                caption
              />
              <Comment
                avatar={avatar}
                comment={post.data.caption}
                username={username}
              />
            </div>
            <div className="post-dialog__stats">
              <div className="post-dialog__actions">
                {currentUser &&
                post.data.likes.includes(currentUser.username) ? (
                  <Icon
                    onClick={event => likeImage(event)}
                    className="icon--button post-dialog__like color-red"
                    icon="heart"
                  />
                ) : (
                  <Icon
                    onClick={event => likeImage(event)}
                    className="icon--button post-dialog__like"
                    icon="heart-outline"
                  />
                )}
                <Icon
                  onClick={event => {
                    event.nativeEvent.stopImmediatePropagation();
                    document.querySelector('.add-comment__input').focus();
                  }}
                  className="icon--button"
                  icon="chatbubble-outline"
                />
                <Icon className="icon--button" icon="paper-plane-outline" />
                <Icon className="icon--button" icon="bookmark-outline" />
              </div>
              <p className="heading-4">
                {post.data.likes.length === 0 ? (
                  <span>
                    Be the first to{' '}
                    <b
                      style={{ cursor: 'pointer' }}
                      onClick={event => likeImage(event)}
                    >
                      like this
                    </b>
                  </span>
                ) : (
                  <span>
                    <b>
                      {post.data.likes.length}{' '}
                      {post.data.likes.length === 1 ? 'like' : 'likes'}
                    </b>
                  </span>
                )}
              </p>
              <p className="heading-5 color-light uppercase">february 28</p>
            </div>
            <div className="post-dialog__add-comment">
              <input
                className="add-comment__input"
                type="text"
                placeholder="Add a comment..."
              />
              <h2 className="heading-3--button color-blue">Post</h2>
            </div>
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
