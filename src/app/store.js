import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from '../app/slices/authSlice';

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});

export default store;
