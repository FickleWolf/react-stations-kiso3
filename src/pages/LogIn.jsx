import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Header from '../components/Header';
import './logIn.scss';
import { signIn } from '../app/slices/authSlice';
import { setUserInfoAsync } from '../app/slices/userInfoSlice';
import baseUrl from '../const';

function LogIn() {
  const auth = useSelector(state => state.auth.isSignIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState();
  const [, setCookie] = useCookies();
  const { register, handleSubmit, formState } = useForm({
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
    },
    shouldUnregister: false,
  });
  const onLogin = formData => {
    const data = {
      email: formData.email,
      password: formData.password,
    };
    axios
      .post(`${baseUrl}/signin`, data)
      .then(res => {
        setCookie('token', res.data.token);
        dispatch(signIn());
        dispatch(setUserInfoAsync(res.data.token));
        navigate('/');
      })
      .catch(err => {
        setErrorMessage(`ログインに失敗しました。${err}`);
      });
  };

  if (auth) return <Navigate to="/" />;

  return (
    <div>
      <Header />
      <main className="login">
        <h2>ログイン</h2>
        <form className="login-form" onSubmit={handleSubmit(onLogin)}>
          <label>
            メールアドレス
            <br />
            <input
              type="email"
              className="email-input"
              {...register('email', {
                required: {
                  value: true,
                  message: 'メールアドレスの入力は必須です。',
                },
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: '有効なメールアドレスを入力してください。',
                },
              })}
            />
            {formState.errors.password ? (
              <p className="error-message" role="alert">
                {formState.errors.email && formState.errors.email.message}
              </p>
            ) : null}
          </label>
          <label>
            パスワード
            <br />
            <input
              type="password"
              className="password-input"
              {...register('password', {
                required: {
                  value: true,
                  message: 'パスワードの入力は必須です。',
                },
                pattern: {
                  value: /^[a-z\d]{4,20}$/i,
                  message:
                    'パスワードは半角英数4文字以上20文字以内で入力してください。',
                },
              })}
            />
            {formState.errors.password ? (
              <p className="error-message" role="alert">
                {formState.errors.password && formState.errors.password.message}
              </p>
            ) : null}
          </label>
          <button type="submit" className="login-button">
            ログイン
          </button>
        </form>
        <Link to="/signup">新規作成</Link>
        <br />
        {errorMessage !== '' ? (
          <p className="error-message" role="alert">
            {errorMessage}
          </p>
        ) : null}
      </main>
    </div>
  );
}

export default LogIn;
