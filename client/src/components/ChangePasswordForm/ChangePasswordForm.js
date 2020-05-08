import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectCurrentUser, selectToken } from '../../redux/user/userSelectors';
import { showAlert } from '../../redux/alert/alertActions';

import { validatePassword } from '../../utils/validation';

import { changePassword } from '../../services/authenticationServices';

import Avatar from '../Avatar/Avatar';
import FormInput from '../FormInput/FormInput';
import Button from '../Button/Button';
import TextButton from '../Button/TextButton/TextButton';
import SettingsForm from '../SettingsForm/SettingsForm';
import SettingsFormGroup from '../SettingsForm/SettingsFormGroup/SettingsFormGroup';

const ChangePasswordForm = ({ currentUser, token, showAlert }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [fetching, setFetching] = useState(false);
  useEffect(() => {
    document.title = 'Change Password • Instaclone';
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (newPassword !== confirmNewPassword) {
      return showAlert('Please make sure both passwords match.');
    }
    const newPasswordError = validatePassword(newPassword);
    if (newPasswordError) return showAlert(newPasswordError);

    try {
      setFetching(true);
      await changePassword(oldPassword, newPassword, token);
      showAlert(
        "Your password has been changed, you'll have to log in with the new one next time."
      );
      setFetching(false);
    } catch (err) {
      setFetching(false);
      showAlert(err.message);
    }
  };

  return (
    <SettingsForm onSubmit={(event) => handleSubmit(event)}>
      <SettingsFormGroup>
        <Avatar className="avatar--small" imageSrc={currentUser.avatar} />
        <h1 className="font-medium" style={{ fontSize: '2.5rem' }}>
          {currentUser.username}
        </h1>
      </SettingsFormGroup>
      <SettingsFormGroup>
        <label className="heading-3 font-bold">Old Password</label>
        <FormInput
          onChange={(event) => setOldPassword(event.target.value)}
          type="password"
        />
      </SettingsFormGroup>
      <SettingsFormGroup>
        <label className="heading-3 font-bold">New Password</label>
        <FormInput
          onChange={(event) => setNewPassword(event.target.value)}
          type="password"
        />
      </SettingsFormGroup>
      <SettingsFormGroup>
        <label className="heading-3 font-bold">Confirm New Password</label>
        <FormInput
          onChange={(event) => setConfirmNewPassword(event.target.value)}
          type="password"
        />
      </SettingsFormGroup>
      <SettingsFormGroup>
        <label></label>
        <Button
          style={{ width: '15rem' }}
          loading={fetching}
          disabled={
            oldPassword.length < 6 ||
            newPassword.length < 6 ||
            confirmNewPassword.length < 6
          }
        >
          Change Password
        </Button>
      </SettingsFormGroup>
      <SettingsFormGroup>
        <label></label>
        <TextButton style={{ width: '15rem', textAlign: 'left' }} blue bold>
          Forgot Password?
        </TextButton>
      </SettingsFormGroup>
    </SettingsForm>
  );
};

const mapDispatchToProps = (dispatch) => ({
  showAlert: (text, onClick) => dispatch(showAlert(text, onClick)),
});

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  token: selectToken,
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangePasswordForm);
