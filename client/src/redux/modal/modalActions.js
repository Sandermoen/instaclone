import modalTypes from './modalTypes';

export const hideModal = () => ({
  type: modalTypes.HIDE_MODAL
});

export const showModal = (props, component) => ({
  type: modalTypes.SHOW_MODAL,
  payload: { props, component }
});
