import React from 'react';
import { Link } from 'react-router-dom';

import Icon from '../../Icon/Icon';

const SmallFooter = () => {
  const links = [
    'About',
    'Help',
    'Press',
    'API',
    'Jobs',
    'Privacy',
    'Terms',
    'Locations',
    'Top Accounts',
    'Hashtags',
    'Language',
  ];
  return (
    <footer className="footer--small color-grey-2 font-bold">
      <div className="footer--small__links">
        {links.map((link, idx) => (
          <Link key={idx} to="/">
            {link}
          </Link>
        ))}
      </div>
      <h5
        className="heading-5 color-grey-2 footer--small__copyright mt-lg font-bold"
        style={{ textTransform: 'uppercase ' }}
      >
        Made with{' '}
        <Icon
          icon="heart"
          className="color-grey-2 icon--small"
          style={{ margin: '0 5px' }}
        />{' '}
        by Sander Moen
      </h5>
    </footer>
  );
};

export default SmallFooter;
