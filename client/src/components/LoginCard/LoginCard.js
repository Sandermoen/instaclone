import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router-dom';

import { signInStart } from '../../redux/user/userActions';

import {
  selectError,
  selectFetching,
  selectCurrentUser,
} from '../../redux/user/userSelectors';

import Button from '../Button/Button';
import FormInput from '../FormInput/FormInput';
import Divider from '../Divider/Divider';
import TextButton from '../Button/TextButton/TextButton';
import ViewOnGithubButton from '../ViewOnGithubButton/ViewOnGithubButton';
import GithubLoginButton from '../GithubLoginButton/GithubLoginButton';
import Card from '../Card/Card';

const LoginCard = ({
  signInStart,
  error,
  fetching,
  currentUser,
  onClick,
  modal,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = (event) => {
    event.preventDefault();
    signInStart(email, password);
  };

  currentUser && onClick();

  return (
    <div
      className="login-card-container"
      style={
        modal
          ? {
              padding: '2rem',
            }
          : {}
      }
    >
      <Card className="form-card">
        <h1 className="heading-logo text-center">Instaclone</h1>
        <form
          onSubmit={(event) => handleSubmit(event)}
          className="form-card__form"
        >
          <FormInput
            placeholder="Username or email address"
            type="text"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <FormInput
            placeholder="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button disabled={fetching} loading={fetching}>
            Log In
          </Button>
        </form>
        <Divider>OR</Divider>
        <GithubLoginButton />
        {error && (
          <p style={{ padding: '1rem 0' }} className="error">
            {error}
          </p>
        )}
        <TextButton style={{ marginTop: '1.5rem' }} darkBlue small>
          Forgot password?
        </TextButton>
      </Card>
      <Card>
        <section
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem',
          }}
        >
          <h4 style={{ marginRight: '5px' }} className="heading-4 font-thin">
            Don't have an account?
          </h4>
          <Link to="/signup" onClick={() => onClick && onClick()}>
            <TextButton medium blue bold>
              Sign up
            </TextButton>
          </Link>
        </section>
      </Card>
      <ViewOnGithubButton />
    </div>
  );
};

LoginCard.propTypes = {
  signInStart: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  signInStart: (email, password) => dispatch(signInStart(email, password)),
});

const mapStateToProps = createStructuredSelector({
  error: selectError,
  fetching: selectFetching,
  currentUser: selectCurrentUser,
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginCard);
