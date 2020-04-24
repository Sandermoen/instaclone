import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';

import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import Header from '../Header/Header';
import HomePage from '../../pages/HomePage';
import ProfilePage from '../../pages/ProfilePage';
import PostPage from '../../pages/PostPage';

/**
 * Renders routes that require a header at the top
 * @function HeaderRoutes
 * @returns {React.Component}
 */
const HeaderRoutes = () => (
  <Fragment>
    <Header />
    <Switch>
      <ProtectedRoute exact path="/">
        <HomePage />
      </ProtectedRoute>
      <Route exact path="/:username" component={ProfilePage} />
      <Route path="/post/:postId" component={PostPage} />
    </Switch>
  </Fragment>
);

export default HeaderRoutes;
