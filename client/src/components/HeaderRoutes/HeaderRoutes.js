import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';

import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import Header from '../Header/Header';
import HomePage from '../../pages/HomePage';
import ProfilePage from '../../pages/ProfilePage';

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
      <Route path="/:username" component={ProfilePage} />
    </Switch>
  </Fragment>
);

export default HeaderRoutes;
