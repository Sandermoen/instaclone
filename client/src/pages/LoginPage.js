import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useHistory } from 'react-router-dom';

import { selectCurrentUser } from '../redux/user/userSelectors';

import LoginCard from '../components/LoginCard/LoginCard';
import Card from '../components/Card/Card';

const LoginPage = ({ currentUser }) => {
  let history = useHistory();
  useEffect(() => {
    if (currentUser) history.push('/');
  }, [currentUser, history]);
  return (
    <div data-test="page-login" className="login-page">
      <LoginCard />
      <Card>Don't have an account?</Card>
    </div>
  );
};

LoginPage.propTypes = {
  currentUser: PropTypes.object
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser
});

export default connect(mapStateToProps)(LoginPage);
