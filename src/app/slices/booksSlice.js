import { createSlice } from '@reduxjs/toolkit';
import { Cookies } from 'react-cookie';
import { useSelector } from 'react-redux';
import axios from 'axios';
import url from '../../const';

const cookie = new Cookies();

// bookReviewを非同期で取得する関数
export const getBooks = async () => {
    const token = cookie.get('token');
    const books = useSelector(state => state.books.books);
    let newBooks ;
    if (!token) {
        try {
            const res = await axios.get(`${url}/public/books?offset=${books.length}`, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });
            newBooks = res.data;
        } catch (error) {
            console.error('Error fetching user info:', error);
            return [];
        }
    }
    else{
        try {
            const res = await axios.get(`${url}/books?offset=${books.length}`, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });
            newBooks = res.data;
        } catch (error) {
            console.error('Error fetching user info:', error);
            return [];
        }
    }

};

// initialStateを定義
const initialState = {
    books: await getBooks(),
};

export const booksSlice = createSlice({
    name: 'books',
    initialState,
    reducers: {
        setUserInfo: (state, action) => {
            state.books = action.payload;
        },
        removeUserInfo: (state) => {
            state.books = undefined;
        },
    },
});

export const { setUserInfo, removeUserInfo } = booksSlice.actions;