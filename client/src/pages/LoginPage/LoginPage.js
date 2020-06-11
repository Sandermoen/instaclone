import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useHistory, useLocation } from 'react-router-dom';

import { githubSignInStart } from '../../redux/user/userActions';
import { selectCurrentUser } from '../../redux/user/userSelectors';

import LoginCard from '../../components/LoginCard/LoginCard';

const LoginPage = ({ currentUser, githubSignInStart }) => {
  const history = useHistory();
  const { search } = useLocation();
  if (currentUser) history.push('/');
  const params = new URLSearchParams(search);
  const code = params.get('code');
  const authState = params.get('state');

  useEffect(() => {
    if (code) {
      if (!authState === sessionStorage.getItem('authState')) {
        return console.warn('Auth state does not match.');
      }
      githubSignInStart(code);
    }
  }, [authState, code, githubSignInStart]);

  return (
    <main data-test="page-login" className="login-page">
      <div className="login-page__showcase"></div>
      <LoginCard />
    </main>
  );
};

LoginPage.propTypes = {
  currentUser: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});

const mapDispatchToProps = (dispatch) => ({
  githubSignInStart: (code) => dispatch(githubSignInStart(code)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
