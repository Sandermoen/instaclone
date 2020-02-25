import React from 'react';
import PropTypes from 'prop-types';

import sprite from '../../assets/svg/svg-sprites.svg';

const ProfileCategory = ({ category, svg }) => (
  <div className="profile-categories">
    <div className="profile-categories__category">
      <svg className="icon--small">
        <use href={sprite + svg} />
      </svg>
      <h3 className="font-medium">{category}</h3>
    </div>
  </div>
);

ProfileCategory.propTypes = {
  category: PropTypes.string.isRequired,
  svg: PropTypes.string.isRequired
};

export default ProfileCategory;
