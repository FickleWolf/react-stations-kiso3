import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './slices/authSlice';
import { userInfoSlice } from './slices/userInfoSlice';

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    userInfo: userInfoSlice.reducer,
  },
});

export default store;
