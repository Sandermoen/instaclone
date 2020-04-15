import React from 'react';

const TextButton = ({ children, onClick, style }) => (
  <button style={style} onClick={onClick} className="text-button">
    {children}
  </button>
);

export default TextButton;
