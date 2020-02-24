import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import { selectToken, selectCurrentUser } from '../../redux/user/userSelectors';

import sprite from '../../assets/svg/svg-sprites.svg';
import Loader from '../Loader/Loader';
import Avatar from '../Avatar/Avatar';

const UploadMediaForm = ({ token, file, hideForm, currentUser }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [formEvents, setFormEvents] = useState({
    error: null,
    isLoading: false
  });

  const history = useHistory();
  const reader = new FileReader();

  // Load a preview image of the image to post
  useEffect(() => {
    if (file.type === 'image/png' || file.type === 'image/jpeg') {
      reader.readAsDataURL(file);
      reader.onload = e => {
        setPreviewImage(e.target.result);
      };
    } else {
      setFormEvents(previous => ({ ...previous, error: 'Invalid file type.' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  /**
   * Takes the selcted file and attempts to post it to the server
   * @function handleClick
   * @param {object} event Event object passed from an input
   */
  const handleClick = async event => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('image', file);
    formData.set('caption', caption);
    try {
      setFormEvents(previous => ({ ...previous, isLoading: true }));
      await axios.post('/post', formData, {
        headers: {
          authorization: token,
          'Content-Type': 'multipart/form-data'
        }
      });
      setFormEvents(previous => ({ ...previous, isLoading: false }));
      history.push('/');
      hideForm();
    } catch (err) {
      setFormEvents({
        isLoading: false,
        error: `Failed to share your post: ${
          err.response.status === 429
            ? err.response.data
            : err.response.data.error
        }`
      });
    }
  };

  return (
    <form style={file && { display: 'block' }} className="upload-media-form">
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
      {formEvents.isLoading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="upload-media-form__input">
            <div className="upload-media-form__avatar">
              <Avatar
                size="3rem"
                imageSrc={
                  currentUser.avatar
                    ? currentUser.avatar
                    : require('../../assets/img/default-avatar.png')
                }
              />
            </div>
            <textarea
              className="upload-media-form__textarea"
              placeholder="Write a caption..."
              onChange={event => setCaption(event.target.value)}
            />
            <div className="upload-media-form__preview">
              <img src={previewImage} alt="Preview" />
            </div>
          </div>
          {formEvents.error && <p className="error">{formEvents.error}</p>}
        </Fragment>
      )}
    </form>
  );
};

const mapStateToProps = createStructuredSelector({
  token: selectToken,
  currentUser: selectCurrentUser
});

export default connect(mapStateToProps)(UploadMediaForm);
