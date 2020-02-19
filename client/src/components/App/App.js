import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import { signInStart } from '../../redux/user/userActions';

import LoginPage from '../../pages/LoginPage';
import HeaderRoutes from '../../components/HeaderRoutes/HeaderRoutes';

export function UnconnectedApp({ signInStart }) {
  const token = localStorage.getItem('token');
  useEffect(() => {
    if (token) {
      signInStart(null, null, token);
    }
  }, [signInStart, token]);
  return (
    <div className="app" data-test="component-app">
      <Switch>
        {!token && (
          <Route path="/login">
            <LoginPage />
          </Route>
        )}
        <Route component={HeaderRoutes} />
      </Switch>
    </div>
  );
}

const mapDispatchToProps = dispatch => ({
  signInStart: (usernameOrEmail, password, token) =>
    dispatch(signInStart(usernameOrEmail, password, token))
});
export default connect(null, mapDispatchToProps)(UnconnectedApp);
