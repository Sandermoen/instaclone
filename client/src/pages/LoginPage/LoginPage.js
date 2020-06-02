import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useHistory } from 'react-router-dom';

import { selectCurrentUser } from '../../redux/user/userSelectors';

import LoginCard from '../../components/LoginCard/LoginCard';

const LoginPage = ({ currentUser }) => {
  let history = useHistory();
  if (currentUser) history.push('/');
  useEffect(() => {}, [currentUser, history]);
  return (
    <div data-test="page-login" className="login-page">
      <LoginCard />
    </div>
  );
};

LoginPage.propTypes = {
  currentUser: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});

export default connect(mapStateToProps)(LoginPage);
