import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';

import Avatar from '../Avatar/Avatar';
import Icon from '../Icon/Icon';

const Comment = ({ avatar, comment, username, caption }) => {
  const [replies, setReplies] = useState(null);
  const [toggleReplies, setToggleReplies] = useState(false);

  useEffect(() => {
    if (toggleReplies === true && !replies) {
      console.log('yes');
      axios
        .get(`/post/${comment._id}/comments`)
        .then(response => setReplies(response.data))
        .catch(err => console.warn(err));
    }
  }, [toggleReplies, replies]);

  const renderComment = (avatar, comment, username, reply, caption, key) => (
    <div
      style={reply ? { marginLeft: '5rem' } : {}}
      className="comment"
      key={key}
    >
      <Avatar imageSrc={avatar} className="avatar--small" />
      <div className="comment__content">
        <p className="heading-4">
          <b>{username}</b> {comment.message}
        </p>
        <div className="comment__stats">
          <p className="heading-5 color-light">4 d</p>
          {!caption && (
            <Fragment>
              <p className="heading-5 color-light">10 likes</p>
              <button
                onClick={() => {
                  const inputField = document.querySelector(
                    '.add-comment__input'
                  );
                  inputField.focus();
                  inputField.value = `@${username} `;
                }}
                className="heading-5 heading--button color-light"
              >
                reply
              </button>
            </Fragment>
          )}
        </div>
        {!caption && comment.commentsCount ? (
          <p
            onClick={() => setToggleReplies(previous => !previous)}
            style={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}
            className="heading-5 heading--button color-light"
          >
            <span className="dash mr-lg" />
            {toggleReplies
              ? 'Hide replies'
              : `View replies (${comment.commentsCount})`}
          </p>
        ) : null}
      </div>
      {!caption && (
        <div className="comment__like">
          <Icon icon="heart-outline" className="icon--tiny" />
        </div>
      )}
    </div>
  );

  return (
    <Fragment>
      {renderComment(avatar, comment, username, false, caption, comment._id)}
      {replies && toggleReplies
        ? replies.map(({ message, commentsCount, avatar, username, _id }) =>
            renderComment(
              avatar,
              { message, commentsCount },
              username,
              true,
              false,
              _id
            )
          )
        : null}
    </Fragment>
  );
};

export default Comment;
