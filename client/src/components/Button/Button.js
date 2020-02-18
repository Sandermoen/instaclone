import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Button = ({ children, onClick, inverted }) => {
  const buttonClasses = classNames({
    button: true,
    'button--inverted': inverted
  });
  return (
    <button className={buttonClasses} onClick={onClick}>
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  onClick: PropTypes.func,
  inverted: PropTypes.bool
};

export default Button;
