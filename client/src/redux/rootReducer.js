import { combineReducers } from 'redux';

import userReducer from './user/userReducer.js';
import modalReducer from './modal/modalReducer';

const rootReducer = combineReducers({
  user: userReducer,
  modal: modalReducer
});

export default rootReducer;
