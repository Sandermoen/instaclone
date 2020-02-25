import { useEffect } from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ children }) => {
  const modalRoot = document.querySelector('#modal-root');
  const el = document.createElement('div');
  el.className = 'modal';
  useEffect(() => {
    modalRoot.appendChild(el);
    document.querySelector('body').setAttribute('style', 'overflow-y: hidden;');

    return () => {
      modalRoot.removeChild(el);
    };
  }, [el, modalRoot]);

  return ReactDOM.createPortal(children, el);
};

Modal.whyDidYouRender = true;

export default Modal;
