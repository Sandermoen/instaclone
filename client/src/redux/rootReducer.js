import { combineReducers } from 'redux';

import userReducer from './user/userReducer.js';
import modalReducer from './modal/modalReducer';
import postsReducer from './posts/postsReducer';

const rootReducer = combineReducers({
  user: userReducer,
  modal: modalReducer,
  posts: postsReducer
});

export default rootReducer;
