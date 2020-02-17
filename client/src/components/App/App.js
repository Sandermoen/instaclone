import React from 'react';
import { Switch, Route } from 'react-router-dom';

import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import LoginPage from '../../pages/LoginPage';
import HeaderRoutes from '../../components/HeaderRoutes/HeaderRoutes';

function App() {
  return (
    <div className="app" data-test="component-app">
      <Switch>
        <Route path="/login">
          <LoginPage />
        </Route>
        <ProtectedRoute>
          <HeaderRoutes />
        </ProtectedRoute>
      </Switch>
    </div>
  );
}

export default App;
