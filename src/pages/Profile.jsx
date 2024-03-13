import axios from 'axios';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Compressor from 'compressorjs';
import { setUserInfoAsync } from '../app/slices/userInfoSlice';
import Header from '../components/Header';
import baseUrl from '../const';
import './profile.scss';

function Profile() {
  const userInfo = useSelector(state => state.userInfo.info);
  const auth = useSelector(state => state.auth.isSignIn);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessge] = useState();
  const [cookies, ,] = useCookies();
  const [iconData, setIconData] = useState(null);
  const { register, handleSubmit, formState, setValue } = useForm({
    mode: 'onTouched',
    defaultValues: {
      name: '',
    },
    shouldUnregister: false,
  });

  useEffect(() => {
    if (userInfo)
      setValue('name', userInfo.name, {
        shouldValidate: true,
        shouldDirty: true,
      });
  }, [userInfo]);

  //画像をPOST送信する。
  const uploadIcon = token => {
    const formData = new FormData();
    formData.append('icon', iconData, iconData.name);

    axios
      .post(`${baseUrl}/uploads`, formData, {
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

  const onUpdataUserInfo = formData => {
    const { token } = cookies;
    const data = {
      name: formData.name,
    };
    axios
      .put(`${baseUrl}/users`, data, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        dispatch(setUserInfoAsync(token));
        if (iconData === null) {
          navigate('/');
          return;
        }
        uploadIcon(token);
      })
      .catch(err => {
        setErrorMessge(`ユーザー情報の更新に失敗しました。 ${err}`);
      });
  };

  const displyIcon = () => {
    if (iconData !== null) return URL.createObjectURL(iconData);
    if (userInfo.iconUrl) return userInfo.iconUrl;
    return '/user_icon_default.png';
  };

  if (!auth) return <Navigate to="/" />;
  return (
    <div>
      <Header />
      {userInfo ? (
        <main className="profile">
          <h2>マイページ</h2>
          <img className="upload-icon" src={displyIcon()} alt="upload-icon" />
          <input
            className="icon-input"
            type="file"
            accept=".jpeg,.png"
            onChange={handleFileChange}
          />
          <form
            className="profile-form"
            onSubmit={handleSubmit(onUpdataUserInfo)}
          >
            <label>
              ユーザ名
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
            <button type="submit" className="profile-button">
              更新
            </button>
          </form>
          <br />
          {errorMessage !== '' ? (
            <p className="error-message" role="alert">
              {errorMessage}
            </p>
          ) : null}
        </main>
      ) : null}
    </div>
  );
}

export default Profile;
