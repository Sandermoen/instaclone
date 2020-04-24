import alertTypes from './alertTypes';

const INITIAL_STATE = {
  text: '',
  onClick: null,
  showAlert: false,
};

const alertReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case alertTypes.SHOW_ALERT: {
      const { text, onClick } = action.payload;
      return {
        ...state,
        text,
        onClick,
        showAlert: true,
      };
    }
    case alertTypes.HIDE_ALERT: {
      return INITIAL_STATE;
    }
    default: {
      return state;
    }
  }
};

export default alertReducer;
