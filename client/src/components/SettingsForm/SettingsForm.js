import React from 'react';

const SettingsForm = ({ onSubmit, children }) => (
  <form className="settings-form" onSubmit={onSubmit}>
    {children}
  </form>
);

export default SettingsForm;
