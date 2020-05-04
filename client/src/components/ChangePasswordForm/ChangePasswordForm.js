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

const ChangePasswordForm = ({ currentUser, token, showAlert }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [fetching, setFetching] = useState(false);
  useEffect(() => {
    document.title = 'Change Password • Instaclone';
  });

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
    <form
      onSubmit={(event) => handleSubmit(event)}
      className="change-password-form"
    >
      <aside className="change-password-form__left">
        <Avatar
          className="avatar--small"
          style={{ justifySelf: 'right' }}
          imageSrc={currentUser.avatar}
        />
        <h2 className="heading-3 font-bold">Old Password</h2>
        <h2 className="heading-3 font-bold">New Password</h2>
        <h2 className="heading-3 font-bold">Confirm New Password</h2>
      </aside>
      <div className="change-password-form__right">
        <h1 className="font-medium" style={{ fontSize: '2.5rem', gridRow: '' }}>
          {currentUser.username}
        </h1>
        <FormInput
          onChange={(event) => setOldPassword(event.target.value)}
          type="password"
        />
        <FormInput
          onChange={(event) => setNewPassword(event.target.value)}
          type="password"
        />
        <FormInput
          onChange={(event) => setConfirmNewPassword(event.target.value)}
          type="password"
        />
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
        <TextButton style={{ width: '15rem', textAlign: 'left' }} blue bold>
          Forgot Password?
        </TextButton>
      </div>
    </form>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  token: selectToken,
});

const mapDispatchToProps = (dispatch) => ({
  showAlert: (text, onClick) => dispatch(showAlert(text, onClick)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangePasswordForm);
