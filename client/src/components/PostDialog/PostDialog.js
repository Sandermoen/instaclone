import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectToken, selectCurrentUser } from '../../redux/user/userSelectors';

// import { likePost } from '../../redux/currentProfile/currentProfileActions';

import Avatar from '../Avatar/Avatar';
import Comment from '../Comment/Comment';
import Icon from '../Icon/Icon';

const PostDialog = ({
  image = '',
  likes = [],
  postId = '5e5f43fe2182123600c81bac',
  caption = 'hmm',
  avatar = require('../../assets/img/default-avatar.png'),
  username = 'snader',
  token,
  currentUser
}) => {
  const likeImage = async event => {
    event.nativeEvent.stopImmediatePropagation();
  };

  return (
    <div className="post-dialog">
      <div className="post-dialog__image">
        <img src={image} alt="Post" />
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
            comment={caption}
            username={username}
            caption
          />
          <Comment avatar={avatar} comment={caption} username={username} />
        </div>
        <div className="post-dialog__stats">
          <div className="post-dialog__actions">
            {currentUser && likes.includes(currentUser.username) ? (
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
            {likes.length === 0 ? (
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
                  {likes.length} {likes.length === 1 ? 'like' : 'likes'}
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
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  token: selectToken,
  currentUser: selectCurrentUser
});

PostDialog.whyDidYouRender = true;

export default connect(mapStateToProps)(PostDialog);
