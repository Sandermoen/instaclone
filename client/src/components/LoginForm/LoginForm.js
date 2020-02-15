import React, { useState, Fragment } from 'react';
import { connect } from 'react-redux';

import { authStart } from '../../redux/auth/authActions';

import Button from '../Button/Button';
import FormInput from '../FormInput/FormInput';

const LoginForm = ({ authStart }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = event => {
    event.preventDefault();

    if (!email || !password) {
      return setError('Please fill out both fields before trying to log in');
    }
    authStart(email, password);
    console.log('submitted');
  };

  return (
    <Fragment>
      <form onSubmit={event => handleSubmit(event)} className="login-form">
        <FormInput
          placeholder="Username or email address"
          type="email"
          onChange={e => setEmail(e.target.value)}
          required
        />
        <FormInput
          placeholder="Password"
          type="password"
          onChange={e => setPassword(e.target.value)}
          required
        />
        <Button>Login</Button>
      </form>
      {error && <p className="error">{error}</p>}
    </Fragment>
  );
};

const mapDispatchToProps = dispatch => ({
  authStart: (email, password) => dispatch(authStart(email, password))
});

export default connect(null, mapDispatchToProps)(LoginForm);
