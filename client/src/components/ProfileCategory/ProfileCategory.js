import React from 'react';
import PropTypes from 'prop-types';

import Icon from '../Icon/Icon';

const ProfileCategory = ({ category, icon }) => (
  <div className="profile-categories">
    <div className="profile-categories__category">
      <div className="icon icon--small">
        <Icon icon={icon} />
      </div>
      <h3 className="font-medium">{category}</h3>
    </div>
  </div>
);

ProfileCategory.propTypes = {
  category: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired
};

export default ProfileCategory;
