import React, { useState, memo, Fragment } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Link, NavLink } from 'react-router-dom';
import classNames from 'classnames';

import { selectCurrentUser } from '../../redux/user/userSelectors';

import useScrollPositionThrottled from '../../hooks/useScrollPositionThrottled';

import { ReactComponent as LogoCamera } from '../../assets/svg/logo-camera.svg';
import SearchBox from '../SearchBox/SearchBox';
import UploadMediaButton from '../UploadMediaButton/UploadMediaButton';
import Button from '../Button/Button';
import Icon from '../Icon/Icon';

const Header = memo(({ currentUser }) => {
  const [shouldMinimizeHeader, setShouldMinimizeHeader] = useState(false);
  // Shrink header height and remove logo on scroll
  useScrollPositionThrottled(
    ({ previousScrollPosition, currentScrollPosition }) => {
      setShouldMinimizeHeader(currentScrollPosition > 100);
    }
  );

  const headerClassNames = classNames({
    header: true,
    'header--small': shouldMinimizeHeader,
  });

  return (
    <div className={headerClassNames}>
      <div className="header__content">
        <Link to="/" className="header__logo">
          <div className="header__logo-image">
            <LogoCamera />
          </div>
          <div className="header__logo-header">
            <h3 className="heading-logo">Instaclone</h3>
          </div>
        </Link>
        <SearchBox />
        <div className="header__icons">
          {currentUser ? (
            <Fragment>
              <NavLink
                className="icon"
                activeClassName="icon--active"
                to="/oosdosoosos"
              >
                <Icon icon="compass-outline" />
              </NavLink>
              <NavLink
                className="icon"
                activeClassName="icon--active"
                to="/lakopoeo"
              >
                <Icon icon="heart-outline" />
              </NavLink>
              <NavLink
                className="icon"
                activeClassName="icon--active"
                to={`/${currentUser.username}`}
              >
                <Icon icon="person-circle-outline" />
              </NavLink>
              <UploadMediaButton />
            </Fragment>
          ) : (
            <Fragment>
              <Link style={{ marginRight: '1rem' }} to="/login">
                <Button>Log In</Button>
              </Link>
              <Link to="/signup">
                <h3 className="heading-3 heading--button color-blue">
                  Sign Up
                </h3>
              </Link>
            </Fragment>
          )}
        </div>
      </div>
    </div>
  );
});

Header.whyDidYouRender = true;

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});

export default connect(mapStateToProps)(Header);
