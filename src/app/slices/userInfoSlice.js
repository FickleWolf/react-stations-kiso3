import { createSlice } from '@reduxjs/toolkit';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import url from '../../const';

const cookie = new Cookies();

// ユーザー情報を非同期で取得する関数
export const getUserInfo = async () => {
  const token = cookie.get('token');
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
  info: await getUserInfo(),
};

export const userInfoSlice = createSlice({
  name: 'info',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    removeUserInfo: (state) => {
      state.userInfo = undefined;
    },
  },
});

export const { setUserInfo, removeUserInfo } = userInfoSlice.actions;