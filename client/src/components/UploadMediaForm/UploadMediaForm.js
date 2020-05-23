import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useHistory } from 'react-router-dom';

import { selectToken, selectCurrentUser } from '../../redux/user/userSelectors';

import { createPost } from '../../services/postService';

import Loader from '../Loader/Loader';
import Avatar from '../Avatar/Avatar';
import Icon from '../Icon/Icon';
import MobileHeader from '../Header/MobileHeader/MobileHeader';

const UploadMediaForm = ({ token, file, currentUser, hide }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [formEvents, setFormEvents] = useState({
    error: null,
    isLoading: false,
  });

  const history = useHistory();
  const reader = new FileReader();

  // Load a preview image of the image to post
  useEffect(() => {
    if (file.type === 'image/png' || file.type === 'image/jpeg') {
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
    } else {
      setFormEvents((previous) => ({
        ...previous,
        error: 'Invalid file type.',
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  /**
   * Takes the selcted file and attempts to post it to the server
   * @function handleClick
   * @param {object} event Event object passed from an input
   */
  const handleClick = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('image', file);
    formData.set('caption', caption);
    try {
      setFormEvents((previous) => ({ ...previous, isLoading: true }));
      await createPost(formData, token);
      setFormEvents((previous) => ({ ...previous, isLoading: false }));
      hide();
      history.push('/');
    } catch (err) {
      setFormEvents({
        isLoading: false,
        error: `Failed to share your post ${
          err.response && `: ${err.response.data}`
        }`,
      });
    }
  };

  return (
    <form style={file && { display: 'block' }} className="upload-media-form">
      <MobileHeader show>
        <Icon
          onClick={hide}
          style={{ cursor: 'pointer' }}
          icon="chevron-back"
        />
        <h3 className="heading-3">New Post</h3>
        <h2
          onClick={(event) => handleClick(event)}
          className="heading-3 heading--button color-blue"
        >
          Share
        </h2>
      </MobileHeader>
      {formEvents.isLoading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="upload-media-form__input">
            <div className="upload-media-form__avatar">
              <Avatar
                size="3rem"
                className="avatar--small"
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
              onChange={(event) => setCaption(event.target.value)}
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
  currentUser: selectCurrentUser,
});

export default connect(mapStateToProps)(UploadMediaForm);
