import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';

import { signUpStart } from '../../redux/user/userActions';

import { selectError, selectFetching } from '../../redux/user/userSelectors';

import Button from '../Button/Button';
import TextButton from '../Button/TextButton/TextButton';
import Divider from '../Divider/Divider';
import Icon from '../Icon/Icon';
import Card from '../Card/Card';
import FormInput from '../FormInput/FormInput';
import ViewOnGithubButton from '../ViewOnGithubButton/ViewOnGithubButton';

const SignUpCard = ({ signUpStart, error, fetching }) => {
  const validate = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = 'Enter a valid email address.';
    } else if (
      !values.email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      errors.email = 'Enter a valid email address.';
    }

    if (!values.fullName) {
      errors.fullName = 'Enter a valid name.';
    }

    if (!values.username) {
      errors.username = 'Enter a valid username.';
    } else if (values.username.length > 30 || values.username.length < 3) {
      errors.username = 'Please choose a username between 3 and 30 characters.';
    } else if (!values.username.match(/^[a-zA-Z0-9\_.]+$/)) {
      errors.username =
        'A username can only contain the following: letters A-Z, numbers 0-9 and the symbols _ . ';
    }

    if (!values.password) {
      errors.password = 'Enter a valid password.';
    } else if (values.password.length < 6) {
      errors.password =
        'For security purposes we require a password to be at least 6 characters.';
    } else if (
      !values.password.match(
        /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{6,}$/
      )
    ) {
      errors.password =
        'A password needs to have at least one uppercase letter, one lowercase letter, one special character and one number.';
    }
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
        <Button
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <Icon
            style={{ marginRight: '1rem', color: 'white' }}
            icon="logo-github"
          />{' '}
          Log in with GitHub
        </Button>
        <Divider>OR</Divider>
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
