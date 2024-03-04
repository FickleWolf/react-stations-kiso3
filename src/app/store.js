import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './slices/authSlice';
import { userInfoSlice } from './slices/userInfoSlice';
import { booksSlice } from './slices/booksSlice';

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    userInfo: userInfoSlice.reducer,
    books: booksSlice.reducer,
  },
});

export default store;
