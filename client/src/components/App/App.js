import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import { signInStart } from '../../redux/user/userActions';

import LoginPage from '../../pages/LoginPage';
import HeaderRoutes from '../../components/HeaderRoutes/HeaderRoutes';

export function UnconnectedApp({ signInStart }) {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      signInStart(null, null, token);
    }
  }, [signInStart]);
  return (
    <div className="app" data-test="component-app">
      <Switch>
        <Route path="/login">
          <LoginPage />
        </Route>
        <Route component={HeaderRoutes} />
        <Route>
          <h1>This resource does not exist</h1>
        </Route>
      </Switch>
    </div>
  );
}

const mapDispatchToProps = dispatch => ({
  signInStart: (usernameOrEmail, password, token) =>
    dispatch(signInStart(usernameOrEmail, password, token))
});
export default connect(null, mapDispatchToProps)(UnconnectedApp);
