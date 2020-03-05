import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import { signInStart } from '../../redux/user/userActions';

import LoginPage from '../../pages/LoginPage';
import HeaderRoutes from '../../components/HeaderRoutes/HeaderRoutes';
import Modal from '../../components/Modal/Modal';

export function UnconnectedApp({ signInStart, modal }) {
  const token = localStorage.getItem('token');
  useEffect(() => {
    if (token) {
      signInStart(null, null, token);
    }
  }, [signInStart, token]);
  return (
    <div className="app" data-test="component-app">
      {modal.show && <Modal component={modal.component} {...modal.props} />}
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

const mapStateToProps = state => ({
  modal: state.modal
});

const mapDispatchToProps = dispatch => ({
  signInStart: (usernameOrEmail, password, token) =>
    dispatch(signInStart(usernameOrEmail, password, token))
});
export default connect(mapStateToProps, mapDispatchToProps)(UnconnectedApp);
