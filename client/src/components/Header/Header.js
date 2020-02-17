import React from 'react';
import { Link } from 'react-router-dom';

import sprite from '../../assets/svg/svg-sprites.svg';
import { ReactComponent as LogoCamera } from '../../assets/svg/logo-camera.svg';
import SearchBox from '../SearchBox/SearchBox';

const Header = () => (
  <div className="header">
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
        <svg>
          <use href={sprite + '#icon-compass'} />
        </svg>
        <svg>
          <use href={sprite + '#icon-heart'} />
        </svg>
        <svg>
          <use href={sprite + '#icon-profile-male'} />
        </svg>
      </div>
    </div>
  </div>
);

export default Header;
