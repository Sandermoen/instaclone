import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import { selectToken } from '../../redux/user/userSelectors';

import Avatar from '../Avatar/Avatar';
import Comment from '../Comment/Comment';
import Icon from '../Icon/Icon';

const PostDialog = ({
  post: { image, likes, postId, caption },
  avatar = require('../../assets/img/default-avatar.png'),
  username,
  token
}) => {
  const history = useHistory();

  // Modify the url so that a user can copy it and share it with others
  // /p will be a route that links directly to the post outside of the users profile
  useEffect(() => {
    window.history.pushState(username, caption, `/p/${postId}`);

    return () => {
      window.history.pushState(username, caption, history.location.pathname);
    };
  }, [postId, caption]);

  const likeImage = async () => {
    try {
      await axios({
        method: 'POST',
        url: `/post/${postId}/like`,
        headers: {
          authorization: token
        }
      });
    } catch (err) {
      console.warn(err);
    }
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
            <Icon
              onClick={() => likeImage()}
              className="icon--button"
              icon="heart-outline"
            />
            <Icon className="icon--button" icon="chatbubble-outline" />
            <Icon className="icon--button" icon="paper-plane-outline" />
            <Icon className="icon--button" icon="bookmark-outline" />
          </div>
          <p className="heading-4">
            {likes.length === 0 ? (
              <span>
                Be the first to{' '}
                <b style={{ cursor: 'pointer' }} onClick={() => likeImage()}>
                  like this
                </b>
              </span>
            ) : (
              <span>
                <b>{likes.length} likes</b>
              </span>
            )}
          </p>
          <p className="heading-5 color-light uppercase">february 28</p>
        </div>
        <div className="post-dialog__add-comment">
          <input type="text" placeholder="Add a comment..." />
          <h2 className="heading-3--button color-blue">Post</h2>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  token: selectToken
});

export default connect(mapStateToProps)(PostDialog);
