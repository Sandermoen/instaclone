import React from 'react';
import PropTypes from 'prop-types';

import Icon from '../Icon/Icon';

const ProfileImage = ({ onClick, image, likes }) => (
  <div onClick={onClick} key={image} className="profile-image">
    <img src={image} alt="User post" />
    <div className="profile-image__overlay">
      <span className="profile-image__content">
        {likes.length > 0 && (
          <div className="profile-image__icon">
            <Icon icon="heart" className="icon--white" />
            <span>{likes.length}</span>
          </div>
        )}
        <div className="profile-image__icon">
          <Icon icon="chatbubbles" className="icon--white" />
          <span>0</span>
        </div>
      </span>
    </div>
  </div>
);

ProfileImage.propTypes = {
  onClick: PropTypes.func,
  image: PropTypes.string.isRequired,
  likes: PropTypes.array.isRequired
};

export default ProfileImage;
