import React from 'react';
import classNames from 'classnames';

import Icon from '../Icon/Icon';

const GithubLoginButton = ({ button, style }) => {
  const authState = Math.random().toString(36).slice(2);
  sessionStorage.setItem('authState', authState);

  return (
    <a
      href={`https://github.com/login/oauth/authorize?client_id=${
        process.env.NODE_ENV === 'development'
          ? '90456f1a1c91be6f9ed2'
          : '562f69062d65058bc089'
      }&redirect_uri=${
        window.location.origin
      }/login&state=${authState}&scope=user:email`}
      className={classNames({ 'github-login-button': true, button })}
      style={style}
    >
      <Icon
        style={{ marginRight: '1rem' }}
        icon="logo-github"
        className={classNames({ 'color-white': button })}
      />
      <h3 className={classNames({ 'heading-4': true, 'color-white': button })}>
        Log in with GitHub
      </h3>
    </a>
  );
};

export default GithubLoginButton;
