import React from 'react';
import { Link } from 'react-router-dom';

import Icon from '../../Icon/Icon';

const MobileHeader = ({ children, backArrow, show }) => (
  <header style={show && { display: 'flex' }} className="header--mobile">
    {backArrow && (
      <Link to="/">
        <Icon icon="chevron-back" />
      </Link>
    )}
    {children}
  </header>
);

export default MobileHeader;
