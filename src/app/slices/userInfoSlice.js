import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import url from '../../const';

// ユーザー情報を非同期で取得する関数
export const getUserInfo = async (token) => {
  if (!token) return undefined;
  try {
    const res = await axios.get(`${url}/users`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error('Error fetching user info:', error);
    return undefined;
  }
};

// initialStateを定義
const initialState = {
  info: null,
};

export const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.info = action.payload;
    },
    removeUserInfo: state => {
      state.info = null;
    },
  },
});

export const { setUserInfo, removeUserInfo } = userInfoSlice.actions;

export const setUserInfoAsync = (token) => async (dispatch) => {
  const userInfo = await getUserInfo(token);
  dispatch(setUserInfo(userInfo));
};