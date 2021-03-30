import React, { useState, Fragment } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useHistory } from 'react-router-dom';

import {
  selectToken,
  selectCurrentUser,
} from '../../../redux/user/userSelectors';
import { showAlert } from '../../../redux/alert/alertActions';
import { addPost } from '../../../redux/feed/feedActions';

import { createPost } from '../../../services/postService';

import Avatar from '../../Avatar/Avatar';
import MobileHeader from '../../Header/MobileHeader/MobileHeader';
import Icon from '../../Icon/Icon';
import TextButton from '../../Button/TextButton/TextButton';
import Loader from '../../Loader/Loader';

const NewPostForm = ({
  token,
  file,
  previewImage,
  currentUser,
  hide,
  back,
  showAlert,
  addPost,
}) => {
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const handleClick = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('image', file);
    formData.set('caption', caption);
    formData.set('crop', JSON.stringify(previewImage.crop));
    previewImage.filterName && formData.set('filter', previewImage.filterName);
    try {
      setLoading(true);
      const post = await createPost(formData, token);
      setLoading(false);
      hide();
      if (history.location.pathname === '/') {
        addPost(post);
      } else {
        history.push('/');
      }
    } catch (err) {
      setLoading(false);
      showAlert(err.message || 'Could not share post.', () =>
        handleClick(event)
      );
    }
  };

  return (
    <Fragment>
      {loading && <Loader />}
      <MobileHeader show>
        <Icon
          icon="chevron-back"
          onClick={() => back()}
          style={{ cursor: 'pointer' }}
        />
        <h3 className="heading-3">New Post</h3>
        <TextButton
          bold
          blue
          style={{ fontSize: '1.5rem' }}
          onClick={(event) => handleClick(event)}
        >
          Share
        </TextButton>
      </MobileHeader>
      <form
        style={file && { display: 'block' }}
        className="new-post__form post-form"
      >
        <Fragment>
          <div className="post-form__input">
            <div className="post-form__avatar">
              <Avatar
                size="3rem"
                className="avatar--small"
                imageSrc={
                  currentUser.avatar
                    ? currentUser.avatar
                    : require('../../../assets/img/default-avatar.png').default
                }
              />
            </div>
            <textarea
              className="post-form__textarea"
              placeholder="Write a caption..."
              onChange={(event) => setCaption(event.target.value)}
            />
            <div className="post-form__preview">
              <img
                src={previewImage.src}
                alt="Preview"
                style={{ filter: previewImage.filter }}
              />
            </div>
          </div>
        </Fragment>
      </form>
    </Fragment>
  );
};

const mapStateToProps = createStructuredSelector({
  token: selectToken,
  currentUser: selectCurrentUser,
});

const mapDispatchToProps = (dispatch) => ({
  showAlert: (text, onClick) => dispatch(showAlert(text, onClick)),
  addPost: (post) => dispatch(addPost(post)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewPostForm);
