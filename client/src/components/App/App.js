import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { useTransition } from 'react-spring';

import { signInStart } from '../../redux/user/userActions';
import { showAlert, hideAlert } from '../../redux/alert/alertActions';

import LoginPage from '../../pages/LoginPage';
import HeaderRoutes from '../../components/HeaderRoutes/HeaderRoutes';
import Modal from '../../components/Modal/Modal';
import Alert from '../../components/Alert/Alert';

export function UnconnectedApp({
  signInStart,
  modal,
  alert,
  showAlert,
  hideAlert,
}) {
  const token = localStorage.getItem('token');
  const ALERT_TIME = 10000;
  useEffect(() => {
    if (token) {
      signInStart(null, null, token);
    }
  }, [signInStart, token]);

  useEffect(() => {
    if (alert.showAlert) {
      setTimeout(() => hideAlert(), ALERT_TIME);
    }
  }, [alert.showAlert]);

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

  const transitions = useTransition(alert.showAlert, null, {
    from: {
      transform: 'translateY(4rem)',
    },
    enter: {
      transform: 'translateY(0rem)',
    },
    leave: {
      transform: 'translateY(4rem)',
    },
    config: {
      tension: 500,
      friction: 50,
    },
  });

  return (
    <div className="app" data-test="component-app">
      {renderModals()}
      {transitions.map(
        ({ item, props, key }) =>
          item && (
            <Alert key={key} style={props} onClick={alert.onClick}>
              {alert.text}
            </Alert>
          )
      )}
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
  alert: state.alert,
});

const mapDispatchToProps = (dispatch) => ({
  signInStart: (usernameOrEmail, password, token) =>
    dispatch(signInStart(usernameOrEmail, password, token)),
  showAlert: (text, onClick) => dispatch(showAlert(text, onClick)),
  hideAlert: () => dispatch(hideAlert()),
});
export default connect(mapStateToProps, mapDispatchToProps)(UnconnectedApp);
