import React from 'react';

import LoginCard from '../components/LoginCard/LoginCard';
import Card from '../components/Card/Card';

const LoginPage = () => (
  <div data-test="page-login" className="login-page">
    <LoginCard />
    <Card>Don't have an account?</Card>
  </div>
);

export default LoginPage;
