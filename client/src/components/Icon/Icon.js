import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const Icon = ({ onClick, className, icon }) => {
  const iconClassNames = classNames({
    icon: true,
    [className]: className
  });

  return (
    <div onClick={onClick} className={iconClassNames}>
      <ion-icon name={icon}></ion-icon>
    </div>
  );
};

Icon.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
  icon: PropTypes.string.isRequired
};

export default Icon;
