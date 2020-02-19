import { useEffect } from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ children }) => {
  const modalRoot = document.querySelector('#modal-root');
  const el = document.createElement('div');
  el.className = 'modal';
  useEffect(() => {
    modalRoot.appendChild(el);

    return () => {
      modalRoot.removeChild(el);
    };
  }, [el, modalRoot]);

  return ReactDOM.createPortal(children, el);
};

export default Modal;
