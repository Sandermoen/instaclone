import React from 'react';

import Avatar from '../Avatar/Avatar';
import Comment from '../Comment/Comment';

const PostDialog = ({
  imageUrl,
  likes,
  comments,
  avatar = require('../../assets/img/default-avatar.png'),
  username
}) => (
  <div className="post-dialog">
    <div className="post-dialog__image">
      <img src={imageUrl} alt="Post" />
    </div>
    <div className="post-dialog__content">
      <header className="post-dialog__header">
        <Avatar className="avatar--small" imageSrc={avatar} />
        <p className="heading-4 heading-4--bold">
          <b>{username}</b>
        </p>
        <div style={{ cursor: 'pointer' }} className="post-dialog__more">
          <div className="icon icon--small">
            <ion-icon name="ellipsis-horizontal"></ion-icon>
          </div>
        </div>
      </header>
      {/* These will be converted to their own components */}
      <div className="comments">
        <Comment
          avatar={avatar}
          comment={comments}
          username={username}
          caption
        />
        <Comment avatar={avatar} comment={comments} username={username} />
      </div>
      <div className="post-dialog__stats">
        <div className="post-dialog__actions">
          <div className="icon">
            <ion-icon name="heart-outline"></ion-icon>
          </div>
          <div className="icon">
            <ion-icon name="chatbubble-outline"></ion-icon>
          </div>
          <div className="icon">
            <ion-icon name="paper-plane-outline"></ion-icon>
          </div>
          <div className="icon">
            <ion-icon name="bookmark-outline"></ion-icon>
          </div>
        </div>
        <p className="heading-4">
          Be the first to <b>like this</b>
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

export default PostDialog;
