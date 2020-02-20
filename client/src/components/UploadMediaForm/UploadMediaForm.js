import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import { selectToken } from '../../redux/user/userSelectors';

import sprite from '../../assets/svg/svg-sprites.svg';
import Avatar from '../Avatar/Avatar';

const UploadMediaForm = ({ token, file }) => {
  const [previewImage, setPreviewImage] = useState(null);

  const history = useHistory();

  const fileSelector = useRef(null);
  const reader = new FileReader();

  // Load a preview image of the image to post
  useEffect(() => {
    if (file) {
      reader.readAsDataURL(file);
      reader.onload = e => {
        setPreviewImage(e.target.result);
      };
    }
  }, [file, reader]);

  const handleClick = async event => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('image', file);
    try {
      await axios.post('/file', formData, {
        headers: {
          authorization: token,
          'Content-Type': 'multipart/form-data'
        }
      });
      history.push('/');
    } catch {
      history.push('/');
    }
  };

  return (
    <form style={file && { display: 'block' }} className="upload-media-form">
      <input
        ref={fileSelector}
        onChange={event => {
          // setFile(event.target.files[0]);
        }}
        style={{ display: 'none' }}
        type="file"
        id="file"
      />
      <header className="upload-media-form__header">
        <svg className="icon">
          <use href={sprite + '#icon-arrow_back_ios'} />
        </svg>
        <h2 className="heading-3">New Post</h2>
        <h2
          onClick={event => handleClick(event)}
          className="heading-3--button heading-3--blue"
        >
          Share
        </h2>
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
          <img src={previewImage} alt="Preview" />
        </div>
      </div>
    </form>
  );
};

const mapStateToProps = createStructuredSelector({
  token: selectToken
});

export default connect(mapStateToProps)(UploadMediaForm);
