import React from 'react';

import Modal from '../Modal/Modal';
import Avatar from '../Avatar/Avatar';

import sprite from '../../assets/svg/svg-sprites.svg';

const PostDialog = ({ imageUrl, likes, comments, avatar }) => (
  <Modal>
    <div className="post-dialog">
      <div className="post-dialog__image">
        <img src={imageUrl} alt="Post" />
      </div>
      <header className="post-dialog__header">
        <Avatar className="icon--large" imageSrc={avatar} />
        <p className="heading-4">snader</p>
        <div style={{ cursor: 'pointer' }} className="post-dialog__more">
          <svg className="icon">
            <use href={sprite + '#icon-more-horizontal'} />
          </svg>
        </div>
      </header>
      {/* These will be converted to their own components */}
      <div className="post-dialog__comments"></div>
      <div className="post-dialog__actions"></div>
      <div className="post-dialog__add-comment"></div>
    </div>
  </Modal>
);

export default PostDialog;
