import { combineReducers } from 'redux';

import userReducer from './user/userReducer.js';
import currentProfileReducer from './currentProfile/currentProfileReducer';

const rootReducer = combineReducers({
  user: userReducer,
  currentProfile: currentProfileReducer
});

export default rootReducer;
