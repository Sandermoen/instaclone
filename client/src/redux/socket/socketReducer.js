import socketTypes from './socketTypes';

const INTIAL_STATE = {
  socket: null,
};

const socketReducer = (state = INTIAL_STATE, action) => {
  switch (action.type) {
    case socketTypes.CONNECT: {
      return {
        ...state,
        socket: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

export default socketReducer;
