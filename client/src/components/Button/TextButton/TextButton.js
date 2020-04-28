import React from 'react';
import ClassNames from 'classnames';

const TextButton = ({
  children,
  onClick,
  style,
  blue,
  darkBlue,
  bold,
  medium,
  small,
}) => {
  const textButtonClassNames = ClassNames({
    'text-button': true,
    'heading-4': medium,
    'heading-5': small,
    'color-blue': blue,
    'color-blue-2': darkBlue,
    'font-bold': bold,
  });
  return (
    <button style={style} onClick={onClick} className={textButtonClassNames}>
      {children}
    </button>
  );
};

export default TextButton;
