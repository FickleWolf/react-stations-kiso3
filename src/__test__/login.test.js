import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import LogIn from '../pages/LogIn';

// モックストアを作成
const mockStore = configureStore([]);
const store = mockStore({
  auth: {
    isSignIn: false,
  },
});

describe('LogIn Component', () => {
  it('renders login form with email and password fields', () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          <LogIn />
        </Provider>
      </MemoryRouter>
    );

    // メールアドレス入力フィールドが存在することを確認
    expect(screen.getByLabelText('メールアドレス')).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'メールアドレス' })
    ).toBeInTheDocument();

    // パスワード入力フィールドが存在することを確認
    expect(screen.getByLabelText('パスワード')).toBeInTheDocument();
    expect(screen.getByLabelText('パスワード').type).toEqual('password');

    // ログインボタンが存在することを確認
    expect(
      screen.getByRole('button', { name: 'ログイン' })
    ).toBeInTheDocument();
  });

  it('displays error message when login fails', async () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          {' '}
          {/* Providerでラップ */}
          <LogIn />
        </Provider>
      </MemoryRouter>
    );

    // フォーム送信
    userEvent.click(screen.getByRole('button', { name: 'ログイン' }));

    // エラーメッセージが表示されることを確認
    expect(await screen.findByRole('alert')).toBeInTheDocument();
  });
});
