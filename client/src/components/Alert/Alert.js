import React from 'react';
import { animated } from 'react-spring';

import TextButton from '../Button/TextButton/TextButton';

const Alert = ({ children, onClick, style }) => (
  <animated.div style={style} className="alert">
    <h3 style={{ color: 'white' }} className="heading-3 font-medium">
      {children}
    </h3>
    {onClick && (
      <TextButton onClick={onClick} blue bold>
        Retry
      </TextButton>
    )}
  </animated.div>
);

export default Alert;
