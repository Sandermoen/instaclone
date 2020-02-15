import React from 'react';
import { Switch, Route } from 'react-router-dom';

import LoginPage from '../../pages/LoginPage';

function App() {
  return (
    <div className="app" data-test="component-app">
      <Switch>
        <Route exact path="/">
          <LoginPage />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
