import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';

import Header from '../Header/Header';
import HomePage from '../../pages/HomePage';

/**
 * Renders routes that require a header at the top
 * @function HeaderRoutes
 * @returns {React.Component}
 */
const HeaderRoutes = () => (
  <Fragment>
    <Header />
    <Switch>
      <Route exact path="/">
        <HomePage />
      </Route>
    </Switch>
  </Fragment>
);

export default HeaderRoutes;
