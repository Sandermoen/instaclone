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

  const renderModals = () => {
    if (modal.modals.length > 0) {
      // Disable scrolling on the body while a modal is active
      document.querySelector('body').setAttribute('style', 'overflow: hidden;');
      return modal.modals.map((modal, idx) => (
        <Modal key={idx} component={modal.component} {...modal.props} />
      ));
    } else {
      document.querySelector('body').setAttribute('style', '');
    }
  };

  return (
    <div className="app" data-test="component-app">
      {renderModals()}
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

const mapStateToProps = (state) => ({
  modal: state.modal,
});

const mapDispatchToProps = (dispatch) => ({
  signInStart: (usernameOrEmail, password, token) =>
    dispatch(signInStart(usernameOrEmail, password, token)),
});
export default connect(mapStateToProps, mapDispatchToProps)(UnconnectedApp);
