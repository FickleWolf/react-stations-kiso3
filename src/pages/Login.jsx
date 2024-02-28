import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import './signin.scss';
import { signIn } from '../app/slices/authSlice';
import url from '../const';

function Login() {
  const auth = useSelector(state => state.auth.isSignIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState();
  const [, setCookie] = useCookies();
  const handleEmailChange = e => setEmail(e.target.value);
  const handlePasswordChange = e => setPassword(e.target.value);
  const onSignIn = () => {
    axios
      .post(`${url}/signin`, { email, password })
      .then(res => {
        setCookie('token', res.data.token);
        dispatch(signIn());
        navigate('/');
      })
      .catch(err => {
        setErrorMessage(`サインインに失敗しました。${err}`);
      });
  };

  if (auth) return <Navigate to="/" />;

  return (
    <div>
      <Header />
      <main className="login">
        <h2>サインイン</h2>
        {errorMessage !== '' ? (
          <p className="error-message" role="alert">
            {errorMessage}
          </p>
        ) : null}
        <form className="login-form">
          <label>メールアドレス</label>
          <br />
          <input
            type="email"
            className="email-input"
            onChange={handleEmailChange}
          />
          <br />
          <label>パスワード</label>
          <br />
          <input
            type="password"
            className="password-input"
            onChange={handlePasswordChange}
          />
          <br />
          <button type="button" className="login-button" onClick={onSignIn}>
            サインイン
          </button>
        </form>
        <Link to="/signup">新規作成</Link>
      </main>
    </div>
  );
}

export default Login;
