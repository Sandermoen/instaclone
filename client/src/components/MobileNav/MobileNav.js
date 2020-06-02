import React from 'react';
import { Link, useHistory } from 'react-router-dom';

import Icon from '../Icon/Icon';
import NotificationButton from '../Notification/NotificationButton/NotificationButton';
import NewPostButton from '../NewPost/NewPostButton/NewPostButton';

const MobileNav = ({ currentUser }) => {
  const {
    location: { pathname },
  } = useHistory();

  return (
    <nav className="mobile-nav">
      <ul className="mobile-nav__list">
        <li>
          <Link to="/">
            <Icon icon={pathname === '/' ? 'home' : 'home-outline'} />
          </Link>
        </li>
        <li>
          <Link to="/explore">
            <Icon
              icon={pathname === '/explore' ? 'search' : 'search-outline'}
            />
          </Link>
        </li>
        <li>
          <NewPostButton plusIcon />
        </li>
        <li>
          <Link to="/activity">
            <NotificationButton
              mobile
              icon={pathname === '/activity' ? 'heart' : 'heart-outline'}
            />
          </Link>
        </li>
        <li>
          <Link to={`/${currentUser.username}`}>
            <Icon
              icon={
                pathname === `/${currentUser.username}`
                  ? 'person-circle'
                  : 'person-circle-outline'
              }
            />
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default MobileNav;
