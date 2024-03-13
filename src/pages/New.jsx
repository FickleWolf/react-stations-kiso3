import axios from 'axios';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { setBooksAsync } from '../app/slices/booksSlice';
import Header from '../components/Header';
import baseUrl from '../const';
import './new.scss';

function New() {
  const navigate = useNavigate();
  const auth = useSelector(state => state.auth.isSignIn);
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessge] = useState();
  const [cookies, ,] = useCookies();
  const { register, handleSubmit, formState } = useForm({
    mode: 'onTouched',
    defaultValues: {
      title: '',
      url: '',
      detail: '',
      review: '',
    },
    shouldUnregister: false,
  });

  const onCreateReview = formData => {
    const { token } = cookies;
    const data = {
      title: formData.title,
      url: formData.url,
      detail: formData.detail,
      review: formData.review,
    };
    axios
      .post(`${baseUrl}/books`, data, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        dispatch(setBooksAsync(token));
        navigate('/');
      })
      .catch(err => {
        setErrorMessge(`投稿に失敗しました。 ${err}`);
      });
  };

  if (!auth) return <Navigate to="/" />;

  return (
    <div>
      <Header />
      <main className="new">
        <h2>新しいレビューの作成</h2>
        <form className="new-form" onSubmit={handleSubmit(onCreateReview)}>
          <label className="title-label">
            タイトル
            <br />
            <input
              type="text"
              className="title-input"
              {...register('title', {
                required: {
                  value: true,
                  message: 'タイトルの入力は必須です。',
                },
              })}
            />
            {formState.errors.title ? (
              <p className="error-message" role="alert">
                {formState.errors.title && formState.errors.title.message}
              </p>
            ) : null}
          </label>
          <label className="url-label">
            URL
            <br />
            <input
              type="text"
              className="url-input"
              {...register('url', {
                required: {
                  value: true,
                  message: 'URLの入力は必須です。',
                },
                pattern: {
                  value: /^(ftp|http|https):\/\/[^ "]+$/,
                  message: '有効なURLを入力してください',
                },
              })}
            />
            {formState.errors.url ? (
              <p className="error-message" role="alert">
                {formState.errors.url && formState.errors.url.message}
              </p>
            ) : null}
          </label>
          <label className="detail-label">
            詳細
            <br />
            <textarea
              type="text"
              className="detail-input"
              {...register('detail', {
                required: {
                  value: true,
                  message: '詳細の入力は必須です。',
                },
              })}
            />
            {formState.errors.detail ? (
              <p className="error-message" role="alert">
                {formState.errors.detail && formState.errors.detail.message}
              </p>
            ) : null}
            <br />
          </label>
          <label className="review-label">
            レビュー
            <br />
            <textarea
              type="text"
              className="review-input"
              {...register('review', {
                required: {
                  value: true,
                  message: 'レビューの入力は必須です。',
                },
              })}
            />
            {formState.errors.review ? (
              <p className="error-message" role="alert">
                {formState.errors.review && formState.errors.review.message}
              </p>
            ) : null}
            <br />
          </label>
          <button type="submit" className="new-button">
            作成
          </button>
        </form>
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

export default New;
