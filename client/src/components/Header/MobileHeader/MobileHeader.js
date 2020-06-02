import React from 'react';
import { useHistory } from 'react-router-dom';

import Icon from '../../Icon/Icon';

const MobileHeader = ({ children, backArrow, style, show }) => {
  const { goBack } = useHistory();
  return (
    <header
      style={{ ...style, display: `${show && 'grid'}` }}
      className="header--mobile"
    >
      {backArrow && <Icon onClick={() => goBack()} icon="chevron-back" />}
      {children}
    </header>
  );
};

export default MobileHeader;
