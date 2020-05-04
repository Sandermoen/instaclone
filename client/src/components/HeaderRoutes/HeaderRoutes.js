import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';

import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import Header from '../Header/Header';
import HomePage from '../../pages/HomePage';
import ProfilePage from '../../pages/ProfilePage';
import PostPage from '../../pages/PostPage';
import ConfirmationPage from '../../pages/ConfirmationPage';
import SettingsPage from '../../pages/SettingsPage';

/**
 * Renders routes that require a header at the top
 * @function HeaderRoutes
 * @returns {React.Component}
 */
const HeaderRoutes = () => (
  <Fragment>
    <Header />
    <Switch>
      <ProtectedRoute exact path="/" component={HomePage} />
      <ProtectedRoute path="/settings" component={SettingsPage} />
      <Route exact path="/:username" component={ProfilePage} />
      <Route path="/post/:postId" component={PostPage} />
      <ProtectedRoute path="/confirm/:token" component={ConfirmationPage} />
    </Switch>
  </Fragment>
);

export default HeaderRoutes;
