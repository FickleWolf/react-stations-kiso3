import axios from 'axios';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Compressor from 'compressorjs';
import { signIn } from '../app/slices/authSlice';
import Header from '../components/Header';
import url from '../const';
import './signUp.scss';

function SignUp() {
  const navigate = useNavigate();
  const auth = useSelector(state => state.auth.isSignIn);
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessge] = useState();
  const [, setCookie] = useCookies();
  const [iconData, setIconData] = useState(null);
  const { register, handleSubmit, formState } = useForm({
    mode: 'onTouched',
    defaultValues: {
      email: '',
      name: '',
      password: '',
    },
    shouldUnregister: false,
  });

  //画像をPOST送信する。
  const uploadIcon = token => {
    const formData = new FormData();
    formData.append('icon', iconData, iconData.name);

    axios
      .post(`${url}/uploads`, formData, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        navigate('/');
      })
      .catch(err => {
        console.log(`アイコンのアップロードに失敗しました。 ${err}`);
        navigate('/');
      });
  };

  //画像がアップロードされた際に圧縮する。
  const handleFileChange = event => {
    const file = event.target.files[0];

    if (!file) return;

    new Compressor(file, {
      quality: 0.6,
      maxWidth: 800,
      maxHeight: 600,
      convertSize: 5000000,
      mimeType: 'image/jpeg',
      success(result) {
        setIconData(result);
      },
      error(error) {
        console.error('Compression failed:', error);
      },
    });
  };

  const onSignUp = formData => {
    const data = {
      email: formData.email,
      name: formData.name,
      password: formData.password,
    };
    axios
      .post(`${url}/users`, data)
      .then(res => {
        const { token } = res.data;
        dispatch(signIn());
        setCookie('token', token);
        if (iconData === null) {
          navigate('/');
          return;
        }
        uploadIcon(token);
      })
      .catch(err => {
        setErrorMessge(`サインアップに失敗しました。 ${err}`);
      });
  };

  if (auth) return <Navigate to="/" />;

  return (
    <div>
      <Header />
      <main className="signup">
        <h2>新規作成</h2>
        <img
          className="upload-icon"
          src={
            iconData !== null
              ? URL.createObjectURL(iconData)
              : '/user_icon_default.png'
          }
          alt="upload-icon"
        />
        <input
          className="icon-input"
          type="file"
          accept=".jpeg,.png"
          onChange={handleFileChange}
        />
        <form className="signup-form" onSubmit={handleSubmit(onSignUp)}>
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
            {formState.errors.email ? (
              <p className="error-message" role="alert">
                {formState.errors.email && formState.errors.email.message}
              </p>
            ) : null}
          </label>
          <label>
            ユーザ名 (2文字以上10文字以内)
            <br />
            <input
              type="text"
              className="name-input"
              {...register('name', {
                required: {
                  value: true,
                  message: 'ユーザーネームの入力は必須です。',
                },
                minLength: {
                  value: 2,
                  message: 'ユーザーネームは2文字以上で入力してください。',
                },
                maxLength: {
                  value: 10,
                  message: 'ユーザーネームは10文字以内で入力してください。',
                },
              })}
            />
            {formState.errors.name ? (
              <p className="error-message" role="alert">
                {formState.errors.name && formState.errors.name.message}
              </p>
            ) : null}
          </label>
          <label>
            パスワード (半角英数4文字以上20文字以内)
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
            <br />
          </label>
          <button type="submit" className="signup-button">
            作成
          </button>
        </form>
        <Link to="/login">ログイン</Link>
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

export default SignUp;
