import React, { useEffect, useState, memo } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import sprite from '../../assets/svg/svg-sprites.svg';
import { ReactComponent as LogoCamera } from '../../assets/svg/logo-camera.svg';
import SearchBox from '../SearchBox/SearchBox';
import UploadMediaButton from '../UploadMediaButton/UploadMediaButton';

const Header = memo(() => {
  const [scrollOffset, setScrollOffset] = useState(0);
  useEffect(() => {
    console.log('hey');
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
          <svg style={{ maskImage: 'red' }}>
            <use href={sprite + '#icon-compass'} />
          </svg>
          <svg>
            <use href={sprite + '#icon-heart'} />
          </svg>
          <svg>
            <use href={sprite + '#icon-profile-male'} />
          </svg>
          <UploadMediaButton />
        </div>
      </div>
    </div>
  );
});

Header.whyDidYouRender = true;

export default Header;
