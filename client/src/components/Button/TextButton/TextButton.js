import React from 'react';
import ClassNames from 'classnames';

const TextButton = ({
  children,
  blue,
  darkBlue,
  bold,
  large,
  medium,
  small,
  ...additionalProps
}) => {
  const textButtonClassNames = ClassNames({
    'text-button': true,
    'heading-3': large,
    'heading-4': medium,
    'heading-5': small,
    'color-blue': blue,
    'color-blue-2': darkBlue,
    'font-bold': bold,
  });
  return (
    <button {...additionalProps} className={textButtonClassNames}>
      {children}
    </button>
  );
};

export default TextButton;
