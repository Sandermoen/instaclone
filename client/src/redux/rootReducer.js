import { combineReducers } from 'redux';

import userReducer from './user/userReducer.js';

const rootReducer = combineReducers({
  user: userReducer
});

export default rootReducer;
