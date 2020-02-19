import React from 'react';

import sprite from '../../assets/svg/svg-sprites.svg';
import Avatar from '../Avatar/Avatar';

const UploadMediaForm = () => {
  return (
    <form className="upload-media-form">
      <header className="upload-media-form__header">
        <svg className="icon">
          <use href={sprite + '#icon-arrow_back_ios'} />
        </svg>
        <h2 className="heading-3">New Post</h2>
        <h2 className="heading-3--button heading-3--blue">Share</h2>
      </header>
      <div className="upload-media-form__input">
        <div className="upload-media-form__avatar">
          <Avatar
            size="3rem"
            imageSrc="https://iupac.org/wp-content/uploads/2018/05/default-avatar.png"
          />
        </div>
        <textarea
          className="upload-media-form__textarea"
          placeholder="Write a caption..."
        />
        <div className="upload-media-form__preview">
          <img
            src="https://iupac.org/wp-content/uploads/2018/05/default-avatar.png"
            alt="Preview"
          />
        </div>
      </div>
    </form>
  );
};

export default UploadMediaForm;
