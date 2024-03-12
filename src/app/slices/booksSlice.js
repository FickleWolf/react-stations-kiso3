import { createSlice } from '@reduxjs/toolkit';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import url from '../../const';

const cookie = new Cookies();

// initialStateを定義
const initialState = {
  books: [],
};

// bookを非同期で取得する関数
export const fetchBooks = async (token, offset, currentBooks) => {
  if (!token) {
    try {
      const res = await axios.get(`${url}/public/books?offset=${offset}`);
      return [...currentBooks, ...res.data];
    } catch (error) {
      console.error('Error fetching user info:', error);
      return currentBooks;
    }
  } else {
    try {
      const res = await axios.get(`${url}/books?offset=${offset}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      return [...currentBooks, ...res.data];
    } catch (error) {
      console.error('Error fetching user info:', error);
      return currentBooks;
    }
  }
};

export const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    setBooks: (state, action) => {
      state.books = action.payload;
    },
  },
});

export const { setBooks, addBooks } = booksSlice.actions;
export const setBooksAsync = () => async dispatch => {
  const token = cookie.get('token');
  const books = await fetchBooks(token, 0, []);
  dispatch(setBooks(books));
};
export const addBooksAsync = () => async (dispatch, getState) => {
  const token = cookie.get('token');
  const currentBooks = getState().books.books;
  const offset = currentBooks.length;
  const books = await fetchBooks(token, offset, currentBooks);
  dispatch(setBooks(books));
};
