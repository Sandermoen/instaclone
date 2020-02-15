import React, { useState } from 'react';

import Button from '../Button/Button';
import FormInput from '../FormInput/FormInput';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  console.log(email);

  return (
    <form className="login-form">
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
  );
};

export default LoginForm;
