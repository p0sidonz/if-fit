import { combineReducers } from 'redux';

import userReducer from '../modules/user/userSlice';
import socialSlice from 'src/modules/social/socialSlice';
import chatSlice from 'src/modules/chat/chatSlice';

const rootReducer = combineReducers({
  user: userReducer,
  social: socialSlice,
  chat: chatSlice,
});

export default rootReducer;