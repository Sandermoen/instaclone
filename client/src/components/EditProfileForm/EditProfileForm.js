import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { useFormik } from 'formik';
import { createStructuredSelector } from 'reselect';

import {
  selectCurrentUser,
  selectToken,
  selectUpdatingProfile,
} from '../../redux/user/userSelectors';
import { updateProfileStart } from '../../redux/user/userActions';
import { showAlert } from '../../redux/alert/alertActions';

import {
  validateEmail,
  validateFullName,
  validateUsername,
  validateBio,
  validateWebsite,
} from '../../utils/validation';

import Avatar from '../Avatar/Avatar';
import FormInput from '../FormInput/FormInput';
import FormTextarea from '../FormTextarea/FormTextarea';
import Button from '../Button/Button';
import SettingsForm from '../SettingsForm/SettingsForm';
import SettingsFormGroup from '../SettingsForm/SettingsFormGroup/SettingsFormGroup';
import ChangeAvatarButton from '../ChangeAvatarButton/ChangeAvatarButton';

const EditProfileForm = ({
  currentUser,
  showAlert,
  token,
  updateProfileStart,
  updatingProfile,
}) => {
  const validate = (values) => {
    const errors = {};
    const emailError = validateEmail(values.email);
    if (emailError) errors.email = emailError;

    const fullNameError = validateFullName(values.fullName);
    if (fullNameError) errors.fullName = fullNameError;

    const usernameError = validateUsername(values.username);
    if (usernameError) errors.username = usernameError;

    const bioError = validateBio(values.bio);
    if (bioError) errors.bio = bioError;

    const websiteError = validateWebsite(values.website);
    if (websiteError) errors.website = websiteError;

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      email: currentUser.email,
      fullName: currentUser.fullName,
      username: currentUser.username,
      bio: currentUser.bio || '',
      website: currentUser.website || '',
    },
    validate,
    onSubmit: async (values) => {
      await updateProfileStart(token, values);
      showAlert('Profile saved.');
    },
  });

  useEffect(() => {
    document.title = 'Edit Profile • Instaclone';
  }, []);

  return (
    <SettingsForm onSubmit={formik.handleSubmit}>
      <SettingsFormGroup>
        <ChangeAvatarButton>
          <Avatar
            className="avatar--small"
            imageSrc={currentUser.avatar}
            style={{ alignSelf: 'start' }}
          />
        </ChangeAvatarButton>
        <div style={{ lineHeight: '2.2rem' }}>
          <h3 className="heading-2 font-medium">{formik.values.username}</h3>
          <ChangeAvatarButton />
        </div>
      </SettingsFormGroup>
      <SettingsFormGroup>
        <label className="heading-3 font-bold">Name</label>
        <FormInput
          name="fullName"
          fieldProps={formik.getFieldProps('fullName')}
        />
      </SettingsFormGroup>
      <SettingsFormGroup>
        <label className="heading-3 font-bold">Username</label>
        <FormInput
          name="username"
          fieldProps={formik.getFieldProps('username')}
        />
      </SettingsFormGroup>
      <SettingsFormGroup>
        <label className="heading-3 font-bold">Website</label>
        <FormInput
          name="website"
          fieldProps={formik.getFieldProps('website')}
        />
      </SettingsFormGroup>
      <SettingsFormGroup>
        <label className="heading-3 font-bold">Bio</label>
        <FormTextarea name="bio" fieldProps={formik.getFieldProps('bio')} />
      </SettingsFormGroup>
      <SettingsFormGroup>
        <label></label>
        <div>
          <h3 className="heading-3 color-grey font-bold">
            Personal Information
          </h3>
          <p
            style={{ fontSize: '1.3rem', lineHeight: '1.6rem' }}
            className="color-grey"
          >
            Provide your personal information, even if the account is used for a
            business, a pet or something else. This won't be a part of your
            public profile.
          </p>
        </div>
      </SettingsFormGroup>
      <SettingsFormGroup>
        <label className="heading-3 font-bold">Email</label>
        <FormInput name="email" fieldProps={formik.getFieldProps('email')} />
      </SettingsFormGroup>
      <SettingsFormGroup>
        <label></label>
        <Button
          style={{ width: '10rem' }}
          disabled={Object.keys(formik.touched).length === 0}
          loading={updatingProfile}
          onClick={() => {
            if (!formik.isValid) {
              showAlert(Object.values(formik.errors)[0]);
            }
          }}
        >
          Submit
        </Button>
      </SettingsFormGroup>
    </SettingsForm>
  );
};

const mapDispatchToProps = (dispatch) => ({
  updateProfileStart: (authToken, updates) =>
    dispatch(updateProfileStart(authToken, updates)),
  showAlert: (text, onClick) => dispatch(showAlert(text, onClick)),
});

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  token: selectToken,
  updatingProfile: selectUpdatingProfile,
});

export default connect(mapStateToProps, mapDispatchToProps)(EditProfileForm);
