import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import sprite from '../../assets/svg/svg-sprites.svg';
import { ReactComponent as LogoCamera } from '../../assets/svg/logo-camera.svg';
import SearchBox from '../SearchBox/SearchBox';
import UploadMediaForm from '../UploadMediaForm/UploadMediaForm';
import Modal from '../Modal/Modal';

const Header = () => {
  const [file, setFile] = useState(undefined);

  return (
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
          <svg style={{ maskImage: 'red' }}>
            <use href={sprite + '#icon-compass'} />
          </svg>
          <svg>
            <use href={sprite + '#icon-heart'} />
          </svg>
          <svg>
            <use href={sprite + '#icon-profile-male'} />
          </svg>
          <label htmlFor="file-upload">
            <svg>
              <use href={sprite + '#icon-upload'} />
            </svg>
          </label>
          <input
            id="file-upload"
            type="file"
            style={{ display: 'none' }}
            onChange={event => setFile(event.target.files[0])}
          />
        </div>
      </div>
      {file && (
        <Modal>
          <UploadMediaForm file={file} />
        </Modal>
      )}
    </div>
  );
};

export default Header;
