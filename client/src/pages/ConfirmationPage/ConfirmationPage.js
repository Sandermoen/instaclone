import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useHistory, useParams } from 'react-router-dom';

import { showModal } from '../../redux/modal/modalActions';
import { selectToken } from '../../redux/user/userSelectors';

import { confirmUser } from '../../services/userService';

import Loader from '../../components/Loader/Loader';

const VerificationPage = ({ authToken, showModal }) => {
  const history = useHistory();
  const { token } = useParams();
  useEffect(() => {
    if (!authToken) {
      return history.push('/');
    }
    (async function () {
      let children = null;
      try {
        await confirmUser(authToken, token);
        children = (
          <h3 style={{ padding: '2rem' }} className="heading-3">
            Successfully confirmed your email.
          </h3>
        );
      } catch (err) {
        children = (
          <h3 style={{ padding: '2rem' }} className="heading-3">
            Invalid or expired confirmation link.
          </h3>
        );
      }
      showModal(
        {
          options: [],
          title: 'Confirmation',
          cancelButton: false,
          children,
        },
        'OptionsDialog/OptionsDialog'
      );
      return history.push('/');
    })();
  }, [authToken, history, showModal, token]);

  return (
    <main className="verification-page">
      <Loader />
    </main>
  );
};

const mapStateToProps = createStructuredSelector({
  authToken: selectToken,
});

const mapDispatchToProps = (dispatch) => ({
  showModal: (props, component) => dispatch(showModal(props, component)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VerificationPage);
