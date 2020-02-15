import { combineReducers } from 'redux';

import authReducer from './auth/authReducer.js';

const rootReducer = combineReducers({
  auth: authReducer
});

export default rootReducer;
