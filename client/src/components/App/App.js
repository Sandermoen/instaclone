import React, { useEffect, Fragment } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { useTransition } from 'react-spring';

import { selectCurrentUser } from '../../redux/user/userSelectors';
import { signInStart } from '../../redux/user/userActions';
import { hideAlert } from '../../redux/alert/alertActions';
import { connectSocket } from '../../redux/socket/socketActions';
import { fetchNotificationsStart } from '../../redux/notification/notificationActions';

import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import Header from '../Header/Header';
import HomePage from '../../pages/HomePage';
import ProfilePage from '../../pages/ProfilePage';
import PostPage from '../../pages/PostPage';
import ConfirmationPage from '../../pages/ConfirmationPage';
import SettingsPage from '../../pages/SettingsPage';
import ActivityPage from '../../pages/ActivityPage';
import LoginPage from '../../pages/LoginPage';
import SignUpPage from '../../pages/SignUpPage';
import LoadingPage from '../../pages/LoadingPage';
import Modal from '../../components/Modal/Modal';
import Alert from '../../components/Alert/Alert';
import Footer from '../../components/Footer/Footer';
import MobileNav from '../../components/MobileNav/MobileNav';

export function UnconnectedApp({
  signInStart,
  modal,
  alert,
  hideAlert,
  currentUser,
  connectSocket,
  fetchNotificationsStart,
}) {
  const token = localStorage.getItem('token');
  const ALERT_TIME = 10000;
  const {
    location: { pathname },
  } = useHistory();

  useEffect(() => {
    if (token) {
      signInStart(null, null, token);
      connectSocket();
      fetchNotificationsStart(token);
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
    // Wait for authentication
    if (!currentUser && token) {
      return <LoadingPage />;
    }
    return (
      <Fragment>
        {pathname !== '/login' && pathname !== '/signup' && <Header />}
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
          <Route path="/login" component={LoginPage} />
          <Route path="/signup" component={SignUpPage} />
          <ProtectedRoute exact path="/" component={HomePage} />
          <ProtectedRoute path="/settings" component={SettingsPage} />
          <ProtectedRoute path="/activity" component={ActivityPage} />
          <Route exact path="/:username" component={ProfilePage} />
          <Route path="/post/:postId" component={PostPage} />
          <ProtectedRoute path="/confirm/:token" component={ConfirmationPage} />
          <Route>
            <h1>Oof</h1>
          </Route>
        </Switch>
        {pathname !== '/' && <Footer />}
        {pathname !== '/login' && pathname !== '/signup' && currentUser && (
          <MobileNav currentUser={currentUser} />
        )}
      </Fragment>
    );
  };

  return (
    <div
      className="app"
      data-test="component-app"
      // style={{ minHeight: '100vh', position: 'relative' }}
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
  connectSocket: () => dispatch(connectSocket()),
  fetchNotificationsStart: (authToken) =>
    dispatch(fetchNotificationsStart(authToken)),
});
export default connect(mapStateToProps, mapDispatchToProps)(UnconnectedApp);
