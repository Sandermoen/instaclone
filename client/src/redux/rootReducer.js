import { combineReducers } from 'redux';

import userReducer from './user/userReducer.js';
import modalReducer from './modal/modalReducer';
import alertReducer from './alert/alertReducer';
import socketReducer from './socket/socketReducer';
import notificationReducer from './notification/notificationReducer';
import feedReducer from './feed/feedReducer';

const rootReducer = combineReducers({
  user: userReducer,
  modal: modalReducer,
  alert: alertReducer,
  socket: socketReducer,
  notifications: notificationReducer,
  feed: feedReducer,
});

export default rootReducer;
