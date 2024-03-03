import { createSlice } from '@reduxjs/toolkit';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import url from '../../const';

const cookie = new Cookies();

// ユーザー情報を非同期で取得する関数
export const getBooks = async () => {
    const token = cookie.get('token');
    if (!token) {
        try {
            const res = await axios.get(`${url}/public/books`, {
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

};

// initialStateを定義
const initialState = {
    books: await getBooks(),
};

export const booksSlice = createSlice({
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

export const { setUserInfo, removeUserInfo } = booksSlice.actions;