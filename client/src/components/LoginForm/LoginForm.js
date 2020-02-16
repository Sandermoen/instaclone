import React, { useState, Fragment } from 'react';
import { connect } from 'react-redux';

import { signInStart } from '../../redux/user/userActions';

import Button from '../Button/Button';
import FormInput from '../FormInput/FormInput';

const LoginForm = ({ signInStart }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = event => {
    event.preventDefault();

    if (!email || !password) {
      return setError('Please fill out both fields before trying to log in');
    }
    signInStart(email, password);
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
  signInStart: (email, password) => dispatch(signInStart(email, password))
});

export default connect(null, mapDispatchToProps)(LoginForm);
