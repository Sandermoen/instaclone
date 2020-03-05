import modalTypes from './modalTypes';

const INITIAL_STATE = {
  show: false,
  props: undefined,
  component: undefined
};

const modalReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case modalTypes.HIDE_MODAL: {
      return { ...state, ...INITIAL_STATE };
    }
    case modalTypes.SHOW_MODAL: {
      const { props, component } = action.payload;
      return { ...state, show: true, props, component };
    }
    default: {
      return state;
    }
  }
};

export default modalReducer;
