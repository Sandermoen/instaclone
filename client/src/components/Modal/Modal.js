import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const Modal = ({ children, hide }) => {
  const modalRoot = document.querySelector('#modal-root');
  const el = document.createElement('div');
  el.className = 'modal';

  useEffect(() => {
    const hideModal = ({ target }) => {
      if (target === el || !el.contains(target)) {
        hide();
      }
    };
    document.addEventListener('click', hideModal, false);
    modalRoot.appendChild(el);
    document.querySelector('body').setAttribute('style', 'overflow: hidden;');

    return () => {
      document.querySelector('body').setAttribute('style', '');
      document.removeEventListener('click', hideModal, false);
      modalRoot.removeChild(el);
    };
  }, [el, modalRoot, hide]);

  return ReactDOM.createPortal(children, el);
};

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  hide: PropTypes.func.isRequired
};

export default Modal;
