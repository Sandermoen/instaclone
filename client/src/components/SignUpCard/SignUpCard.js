import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';

import { signUpStart } from '../../redux/user/userActions';
import { selectError, selectFetching } from '../../redux/user/userSelectors';

import {
  validateEmail,
  validateFullName,
  validateUsername,
  validatePassword,
} from '../../utils/validation';

import Button from '../Button/Button';
import TextButton from '../Button/TextButton/TextButton';
import Divider from '../Divider/Divider';
import Card from '../Card/Card';
import FormInput from '../FormInput/FormInput';
import ViewOnGithubButton from '../ViewOnGithubButton/ViewOnGithubButton';
import GithubLoginButton from '../GithubLoginButton/GithubLoginButton';

const SignUpCard = ({ signUpStart, error, fetching }) => {
  const validate = (values) => {
    const errors = {};
    const emailError = validateEmail(values.email);
    if (emailError) errors.email = emailError;

    const fullNameError = validateFullName(values.fullName);
    if (fullNameError) errors.fullName = fullNameError;

    const usernameError = validateUsername(values.username);
    if (usernameError) errors.username = usernameError;

    const passwordError = validatePassword(values.password);
    if (passwordError) errors.password = passwordError;
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      fullName: '',
      username: '',
      password: '',
    },
    validate,
    onSubmit: (values) =>
      signUpStart(
        values.email,
        values.fullName,
        values.username,
        values.password
      ),
  });

  return (
    <Fragment>
      <Card className="form-card">
        <h1 className="heading-logo text-center">Instaclone</h1>
        <h2
          style={{ fontSize: '1.7rem' }}
          className="heading-2 color-grey text-center"
        >
          Sign up to see photos and videos from your friends.
        </h2>
        <GithubLoginButton
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            color: 'white',
          }}
          button
        />
        <Divider>OR</Divider>
        {Object.keys(formik.errors).map((field) => {
          if (formik.touched[field]) {
            return (
              <p
                className="error"
                key={formik.errors[field]}
                style={{ marginTop: '0' }}
              >
                {formik.errors[field]}
              </p>
            );
          }
        })}
        <form className="form-card__form" onSubmit={formik.handleSubmit}>
          <FormInput
            name="email"
            fieldProps={formik.getFieldProps('email')}
            valid={formik.touched.email && !formik.errors.email}
            placeholder="Email address"
          />
          <FormInput
            name="fullName"
            fieldProps={formik.getFieldProps('fullName')}
            valid={formik.touched.fullName && !formik.errors.fullName}
            placeholder="Full Name"
          />
          <FormInput
            name="username"
            fieldProps={formik.getFieldProps('username')}
            valid={formik.touched.username && !formik.errors.username}
            placeholder="Username"
          />
          <FormInput
            name="password"
            fieldProps={formik.getFieldProps('password')}
            placeholder="Password"
            valid={formik.touched.password && !formik.errors.password}
            type="password"
          />
          <Button
            loading={fetching}
            disabled={
              Object.keys(formik.touched).length === 0 ? true : !formik.isValid
            }
          >
            Sign Up
          </Button>
          <p></p>
        </form>
        <p className="error">
          {error
            ? error
            : formik.submitCount > 0 && Object.values(formik.errors)[0]}
        </p>
        <p className="heading-5 color-grey">
          By signing up, you agree to our Terms . Learn how we collect, use and
          share your data in our Data Policy and how we use cookies and similar
          technology in our Cookies Policy .
        </p>
      </Card>
      <Card>
        <section
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem',
          }}
        >
          <h4 style={{ marginRight: '5px' }} className="heading-4 font-thin">
            Have an account?
          </h4>
          <Link to="/login">
            <TextButton medium blue bold>
              Log in
            </TextButton>
          </Link>
        </section>
      </Card>
      <ViewOnGithubButton />
    </Fragment>
  );
};

const mapDispatchToProps = (dispatch) => ({
  signUpStart: (email, fullName, username, password) =>
    dispatch(signUpStart(email, fullName, username, password)),
});

const mapStateToProps = createStructuredSelector({
  error: selectError,
  fetching: selectFetching,
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUpCard);
