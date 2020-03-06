import React from 'react';
import PropTypes from 'prop-types';

import Icon from '../Icon/Icon';

const ProfileImage = ({ onClick, image, likes, comments }) => (
  <div onClick={onClick} key={image} className="profile-image">
    <img src={image} alt="User post" />
    <div className="profile-image__overlay">
      <span className="profile-image__content">
        {likes > 0 && (
          <div className="profile-image__icon">
            <Icon icon="heart" className="icon--white" />
            <span>{likes}</span>
          </div>
        )}
        <div className="profile-image__icon">
          <Icon icon="chatbubbles" className="icon--white" />
          <span>{comments}</span>
        </div>
      </span>
    </div>
  </div>
);

ProfileImage.propTypes = {
  onClick: PropTypes.func,
  image: PropTypes.string.isRequired,
  likes: PropTypes.number.isRequired
};

export default ProfileImage;
