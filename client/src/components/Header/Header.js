import React, { useEffect, useState, memo, Fragment } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Link, NavLink } from 'react-router-dom';
import classNames from 'classnames';

import { selectCurrentUser } from '../../redux/user/userSelectors';

import sprite from '../../assets/svg/svg-sprites.svg';
import { ReactComponent as LogoCamera } from '../../assets/svg/logo-camera.svg';
import SearchBox from '../SearchBox/SearchBox';
import UploadMediaButton from '../UploadMediaButton/UploadMediaButton';

const Header = memo(({ currentUser }) => {
  const [scrollOffset, setScrollOffset] = useState(0);
  useEffect(() => {
    // Shrink header height and remove logo on scroll
    window.onscroll = () => setScrollOffset(window.pageYOffset);

    return () => {
      window.removeEventListener('scroll', setScrollOffset, false);
    };
  }, [setScrollOffset]);

  const headerClassNames = classNames({
    header: true,
    'header--small': scrollOffset > 60
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
          {currentUser && (
            <Fragment>
              <NavLink
                className="icon"
                activeClassName="icon--active"
                to="/oosdosoosos"
              >
                <svg style={{ maskImage: 'red' }}>
                  <use href={sprite + '#icon-compass'} />
                </svg>
              </NavLink>
              <NavLink
                className="icon"
                activeClassName="icon--active"
                to="/lakopoeo"
              >
                <svg>
                  <use href={sprite + '#icon-heart'} />
                </svg>
              </NavLink>
              <NavLink
                className="icon"
                activeClassName="icon--active"
                to={`/${currentUser.username}`}
              >
                <svg>
                  <use href={sprite + '#icon-profile-male'} />
                </svg>
              </NavLink>
              <UploadMediaButton />
            </Fragment>
          )}
        </div>
      </div>
    </div>
  );
});

Header.whyDidYouRender = true;

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser
});

export default connect(mapStateToProps)(Header);
