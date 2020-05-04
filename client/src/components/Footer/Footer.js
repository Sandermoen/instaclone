import React from 'react';

import TextButton from '../Button/TextButton/TextButton';
import Icon from '../Icon/Icon';

const Footer = () => (
  <footer className="footer">
    <div className="footer__left">
      <TextButton className="font-medium" small darkBlue>
        ABOUT
      </TextButton>
      <TextButton small darkBlue>
        HELP
      </TextButton>
      <TextButton small darkBlue>
        PRESS
      </TextButton>
      <TextButton small darkBlue>
        API
      </TextButton>
      <TextButton small darkBlue>
        JOBS
      </TextButton>
      <TextButton small darkBlue>
        PRIVACY
      </TextButton>
      <TextButton small darkBlue>
        TERMS
      </TextButton>
    </div>
    <div className="footer__right">
      <h4
        className="heading-4 color-grey font-medium"
        style={{ display: 'flex', alignItems: 'center' }}
      >
        MADE WITH
        <Icon
          className="icon--small color-grey"
          icon="heart"
          style={{ display: 'inline-block', margin: '0 5px' }}
        />{' '}
        BY SANDER MOEN
      </h4>
    </div>
  </footer>
);

export default Footer;
