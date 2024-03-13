import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import baseUrl from '../../const';

// initialStateを定義
const initialState = {
  books: [],
};

// bookを非同期で取得する関数
export const fetchBooks = async (token, offset, currentBooks) => {
  if (!token) {
    try {
      const res = await axios.get(`${baseUrl}/public/books?offset=${offset}`);
      return [...currentBooks, ...res.data];
    } catch (error) {
      console.error('Error fetching user info:', error);
      return currentBooks;
    }
  } else {
    try {
      const res = await axios.get(`${baseUrl}/books?offset=${offset}`, {
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
export const setBooksAsync = token => async dispatch => {
  const books = await fetchBooks(token, 0, []);
  dispatch(setBooks(books));
};
export const addBooksAsync = token => async (dispatch, getState) => {
  const currentBooks = getState().books.books;
  const offset = currentBooks.length;
  const books = await fetchBooks(token, offset, currentBooks);
  dispatch(setBooks(books));
};
