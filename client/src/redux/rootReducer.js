import { combineReducers } from 'redux';

import userReducer from './user/userReducer.js';
import modalReducer from './modal/modalReducer';
import alertReducer from './alert/alertReducer';

const rootReducer = combineReducers({
  user: userReducer,
  modal: modalReducer,
  alert: alertReducer,
});

export default rootReducer;
