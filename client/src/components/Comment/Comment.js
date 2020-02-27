import React from 'react';

import Avatar from '../Avatar/Avatar';

import sprite from '../../assets/svg/svg-sprites.svg';

const Comment = ({ avatar, comment, username, caption }) => (
  <div className="comment">
    <Avatar imageSrc={avatar} className="avatar--small" />
    <div className="comment__content">
      <p className="heading-4">
        <b>{username}</b> {comment}
      </p>
      <div className="comment__stats">
        <p className="heading-5 heading-5--light">4 d</p>
        {!caption && <p className="heading-5 heading-5--light">10 likes</p>}
      </div>
    </div>
    {!caption && (
      <div className="comment__like">
        <svg className="icon--small">
          <use href={sprite + '#icon-heart'} />
        </svg>
      </div>
    )}
  </div>
);

export default Comment;
