import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { signInStart } from '../../redux/user/userActions';

import { selectError } from '../../redux/user/userSelectors';

import Button from '../Button/Button';
import FormInput from '../FormInput/FormInput';

const LoginForm = ({ signInStart, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    signInStart(email, password);
  };

  return (
    <Fragment>
      <form onSubmit={(event) => handleSubmit(event)} className="login-form">
        <FormInput
          placeholder="Username or email address"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <FormInput
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button>Login</Button>
      </form>
      {error && (
        <p style={{ padding: '1rem 0' }} className="error">
          {error.error}
        </p>
      )}
    </Fragment>
  );
};

LoginForm.propTypes = {
  signInStart: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  signInStart: (email, password) => dispatch(signInStart(email, password)),
});

const mapStateToProps = createStructuredSelector({
  error: selectError,
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
