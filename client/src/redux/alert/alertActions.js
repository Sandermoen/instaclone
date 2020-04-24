import alertTypes from './alertTypes';

export const hideAlert = () => ({
  type: alertTypes.HIDE_ALERT,
});

export const showAlert = (text, onClick = null) => (dispatch, getState) => {
  const state = getState();
  // If there is an alert already present,
  // disable it and allow the animation to finish
  // before toggling the new one
  if (state.alert.showAlert) {
    dispatch(hideAlert());
    setTimeout(() => {
      dispatch({
        type: alertTypes.SHOW_ALERT,
        payload: { text, onClick },
      });
    }, 500);
  } else {
    dispatch({
      type: alertTypes.SHOW_ALERT,
      payload: { text, onClick },
    });
  }
  // return {
  //   type: alertTypes.SHOW_ALERT,
  //   payload: { text, onClick },
  // };
};
