import React, { useEffect, Fragment, Suspense, lazy } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { useTransition } from 'react-spring';

import { selectCurrentUser } from '../../redux/user/userSelectors';
import { signInStart } from '../../redux/user/userActions';
import { hideAlert } from '../../redux/alert/alertActions';
import { connectSocket } from '../../redux/socket/socketActions';
import { fetchNotificationsStart } from '../../redux/notification/notificationActions';
import { fetchFeedPostsStart } from '../../redux/feed/feedActions';

import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import Header from '../Header/Header';
import Modal from '../../components/Modal/Modal';
import Alert from '../../components/Alert/Alert';
import Footer from '../../components/Footer/Footer';
import MobileNav from '../../components/MobileNav/MobileNav';

import LoadingPage from '../../pages/LoadingPage';
const ProfilePage = lazy(() => import('../../pages/ProfilePage'));
const PostPage = lazy(() => import('../../pages/PostPage'));
const ConfirmationPage = lazy(() => import('../../pages/ConfirmationPage'));
const SettingsPage = lazy(() => import('../../pages/SettingsPage'));
const ActivityPage = lazy(() => import('../../pages/ActivityPage'));
const LoginPage = lazy(() => import('../../pages/LoginPage'));
const SignUpPage = lazy(() => import('../../pages/SignUpPage'));
const HomePage = lazy(() => import('../../pages/HomePage'));
const NewPostPage = lazy(() => import('../../pages/NewPostPage'));

export function UnconnectedApp({
  signInStart,
  modal,
  alert,
  hideAlert,
  currentUser,
  connectSocket,
  fetchNotificationsStart,
  fetchFeedPostsStart,
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
      fetchFeedPostsStart(token);
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
          <ProtectedRoute path="/new" component={NewPostPage} />
          <Route exact path="/:username" component={ProfilePage} />
          <Route path="/post/:postId" component={PostPage} />
          <ProtectedRoute path="/confirm/:token" component={ConfirmationPage} />
          <Route>
            <h1>Oof</h1>
          </Route>
        </Switch>
        {pathname !== '/' && <Footer />}
        {pathname !== '/login' &&
          pathname !== '/signup' &&
          pathname !== '/new' &&
          currentUser && <MobileNav currentUser={currentUser} />}
      </Fragment>
    );
  };

  return (
    <div className="app" data-test="component-app">
      <Suspense fallback={<LoadingPage />}>{renderApp()}</Suspense>
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
  fetchFeedPostsStart: (authToken, offset) =>
    dispatch(fetchFeedPostsStart(authToken, offset)),
});
export default connect(mapStateToProps, mapDispatchToProps)(UnconnectedApp);
