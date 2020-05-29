import React, { useEffect, memo } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { hideModal } from '../../redux/modal/modalActions';

const Modal = memo(({ component, hideModal, ...additionalProps }) => {
  const modalRoot = document.querySelector('#modal-root');
  const el = document.createElement('div');
  const Child = require(`../../components/${component}`).default;
  el.className = 'modal grid';

  useEffect(() => {
    const hide = ({ target }) => {
      if (target === el || !el.contains(target)) {
        hideModal(component);
      }
    };
    el.addEventListener('mousedown', hide, false);
    modalRoot.appendChild(el);

    return () => {
      el.removeEventListener('mousedown', hide, false);
      modalRoot.removeChild(el);
    };
  }, [el, modalRoot, hideModal, component]);

  return ReactDOM.createPortal(
    <Child hide={() => hideModal(component)} {...additionalProps} />,
    el
  );
});

Modal.whyDidYouRender = true;

Modal.propTypes = {
  component: PropTypes.string.isRequired,
  props: PropTypes.object,
};

const mapDispatchToProps = (dispatch) => ({
  hideModal: (component) => dispatch(hideModal(component)),
});

export default connect(null, mapDispatchToProps)(Modal);
