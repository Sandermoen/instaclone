import React, { Fragment } from 'react';

import Avatar from '../Avatar/Avatar';
import Icon from '../Icon/Icon';

const Comment = ({ avatar, comment, username, caption }) => (
  <div className="comment">
    <Avatar imageSrc={avatar} className="avatar--small" />
    <div className="comment__content">
      <p className="heading-4">
        <b>{username}</b> {comment}
      </p>
      <div className="comment__stats">
        <p className="heading-5 color-light">4 d</p>
        {!caption && (
          <Fragment>
            <p className="heading-5 color-light">10 likes</p>
            <button className="heading-5 heading--button color-light">
              reply
            </button>
          </Fragment>
        )}
      </div>
    </div>
    {!caption && (
      <div className="comment__like">
        <Icon icon="heart-outline" className="icon--tiny" />
      </div>
    )}
  </div>
);

export default Comment;
