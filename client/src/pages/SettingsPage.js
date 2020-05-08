import React from 'react';
import { NavLink, Switch } from 'react-router-dom';

import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
import Card from '../components/Card/Card';
import ChangePasswordForm from '../components/ChangePasswordForm/ChangePasswordForm';
import EditProfileForm from '../components/EditProfileForm/EditProfileForm';

const SettingsPage = () => (
  <div className="settings-page grid">
    <Card className="settings-card">
      <ul className="settings-card__sidebar">
        <NavLink
          className="sidebar-link"
          to="/settings/edit"
          activeClassName="font-bold sidebar-link--active"
        >
          <li className="sidebar-link__text">Edit Profile</li>
        </NavLink>
        <NavLink
          className="sidebar-link"
          to="/settings/password"
          activeClassName="font-bold sidebar-link--active"
        >
          <li className="sidebar-link__text">Change Password</li>
        </NavLink>
      </ul>
      <article style={{ padding: '4rem 5rem' }}>
        <Switch>
          <ProtectedRoute path="/settings/edit">
            <EditProfileForm />
          </ProtectedRoute>
          <ProtectedRoute path="/settings/password">
            <ChangePasswordForm />
          </ProtectedRoute>
        </Switch>
      </article>
    </Card>
  </div>
);

export default SettingsPage;
