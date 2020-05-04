import React, { useEffect, Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { useTransition } from 'react-spring';

import { signInStart } from '../../redux/user/userActions';
import { selectCurrentUser } from '../../redux/user/userSelectors';
import { hideAlert } from '../../redux/alert/alertActions';

import LoginPage from '../../pages/LoginPage';
import SignUpPage from '../../pages/SignUpPage';
import LoadingPage from '../../pages/LoadingPage';
import HeaderRoutes from '../../components/HeaderRoutes/HeaderRoutes';
import Modal from '../../components/Modal/Modal';
import Alert from '../../components/Alert/Alert';
import Footer from '../../components/Footer/Footer';

export function UnconnectedApp({
  signInStart,
  modal,
  alert,
  hideAlert,
  currentUser,
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

  const renderApp = () => {
    if (!currentUser && token) {
      return <LoadingPage />;
    }
    return (
      <Fragment>
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
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="/signup">
            <SignUpPage />
          </Route>
          <Route component={HeaderRoutes} />
        </Switch>
        <Footer />
      </Fragment>
    );
  };

  return (
    <div
      className="app"
      data-test="component-app"
      style={{ minHeight: '100vh', position: 'relative' }}
    >
      {renderApp()}
    </div>
  );
}

const mapStateToProps = (state) => ({
  modal: state.modal,
  alert: state.alert,
  currentUser: selectCurrentUser(state),
});

const mapDispatchToProps = (dispatch) => ({
  signInStart: (usernameOrEmail, password, token) =>
    dispatch(signInStart(usernameOrEmail, password, token)),
  hideAlert: () => dispatch(hideAlert()),
});
export default connect(mapStateToProps, mapDispatchToProps)(UnconnectedApp);
