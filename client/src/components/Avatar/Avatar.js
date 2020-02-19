import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Avatar = ({ imageSrc, size, className }) => {
  const avatarClasses = classNames({
    avatar: true,
    [className]: className
  });

  return (
    <div className={avatarClasses}>
      <img
        style={size && { width: size, height: size }}
        src={imageSrc}
        alt="Avatar"
      />
    </div>
  );
};

Avatar.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  size: PropTypes.string,
  className: PropTypes.string
};

export default Avatar;
