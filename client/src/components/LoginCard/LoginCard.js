import React from 'react';

import Card from '../Card/Card';
import LoginForm from '../LoginForm/LoginForm';

const LoginCard = () => (
  <Card className="login-card">
    <h1 className="heading-logo text-center">Instaclone</h1>
    <LoginForm />
  </Card>
);

export default LoginCard;
