import React from 'react';
import ClassNames from 'classnames';

const TextButton = ({ children, onClick, style, blue, bold }) => {
  const textButtonClassNames = ClassNames({
    'text-button': true,
    'color-blue': blue,
    'font-bold': bold,
  });
  return (
    <button style={style} onClick={onClick} className={textButtonClassNames}>
      {children}
    </button>
  );
};

export default TextButton;
