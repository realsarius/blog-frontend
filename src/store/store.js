import { configureStore } from '@reduxjs/toolkit';
import blogReducer from '../reducers/blogSlice';
import notificationReducer from '../reducers/notificationSlice';
import userReducer from '../reducers/userSlice';

const store = configureStore({
  reducer: {
    blogs: blogReducer,
    notification: notificationReducer,
    user: userReducer,
  },
});

export default store;
