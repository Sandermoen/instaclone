import modalTypes from './modalTypes';

/**
 * Hides a show Modal
 * @function hideModal
 */
export const hideModal = () => ({
  type: modalTypes.HIDE_MODAL
});

/**
 * Shows the Modal component with a specified child and props
 * @function showModal
 * @param {object } props Props to pass to the modal child.
 * @param {string} component The directory of a component in the Components directory
 */
export const showModal = (props, component) => ({
  type: modalTypes.SHOW_MODAL,
  payload: { props, component }
});
