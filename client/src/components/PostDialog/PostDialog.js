import React from 'react';

import Modal from '../Modal/Modal';
import Avatar from '../Avatar/Avatar';
import Comment from '../Comment/Comment';

import sprite from '../../assets/svg/svg-sprites.svg';

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
        <p className="heading-4 heading-4--bold">{username}</p>
        <div style={{ cursor: 'pointer' }} className="post-dialog__more">
          <svg className="icon">
            <use href={sprite + '#icon-more-horizontal'} />
          </svg>
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
      <div className="post-dialog__actions"></div>
      <div className="post-dialog__add-comment"></div>
    </div>
  </div>
);

export default PostDialog;
