import { createSlice } from '@reduxjs/toolkit';
import { Cookies } from 'react-cookie';
import { useSelector } from 'react-redux';
import axios from 'axios';
import url from '../../const';

const cookie = new Cookies();

// bookを非同期で取得する関数
export const getBooks = async () => {
  const token = cookie.get('token');
  const books = useSelector(state => state.books.books);
  if (!token) {
    try {
      const res = await axios.get(`${url}/public/books?offset=${books.length}`);
      return res.data;
    } catch (error) {
      console.error('Error fetching user info:', error);
      return [];
    }
  } else {
    try {
      const res = await axios.get(`${url}/books?offset=${books.length}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      return res.data;
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
    addBooks: (state, action) => {
      state.books = [...state.books, ...action.payload];
    },
    resetBooks: state => {
      state.books = action.payload;
    },
  },
});

export const { addBooks, resetBooks } = booksSlice.actions;
