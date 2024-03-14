import axios from 'axios';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { setBooksAsync } from '../app/slices/booksSlice';
import Header from '../components/Header';
import Loading from '../components/Loading';
import './edit.scss';
import baseUrl from '../const';

function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useSelector(state => state.auth.isSignIn);
  const dispatch = useDispatch();
  const [book, setBook] = useState(undefined);
  const [errorMessage, setErrorMessge] = useState();
  const [cookies, ,] = useCookies();
  const { register, handleSubmit, formState, setValue } = useForm({
    mode: 'onTouched',
    defaultValues: {
      title: '',
      url: '',
      detail: '',
      review: '',
    },
    shouldUnregister: false,
  });

  useEffect(() => {
    const { token } = cookies;
    if (!id || !token) {
      if (id) {
        navigate(`/detail/${id}`);
        return;
      }
      navigate('/');
    }

    axios
      .get(`${baseUrl}/books/${id}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then(res => {
        const bookData = res.data;
        setBook(bookData);
        const { title, url, detail, review } = bookData;
        setValue('title', title);
        setValue('url', url);
        setValue('detail', detail);
        setValue('review', review);
      })
      .catch(err => {
        setErrorMessge(`取得に失敗しました。 ${err}`);
      });
  }, []);

  const onUpdataReview = formData => {
    const { token } = cookies;
    const data = {
      title: formData.title,
      url: formData.url,
      detail: formData.detail,
      review: formData.review,
    };
    axios
      .put(`${baseUrl}/books/${id}`, data, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        dispatch(setBooksAsync(token));
        navigate('/');
      })
      .catch(err => {
        setErrorMessge(`投稿の更新に失敗しました。 ${err}`);
      });
  };

  if (!auth) return <Navigate to="/" />;
  return (
    <div>
      <Header />
      {book ? (
        <main className="edit">
          <h2>新しいレビューの作成</h2>
          <form className="edit-form" onSubmit={handleSubmit(onUpdataReview)}>
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
            <button type="submit" className="edit-button">
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
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default Edit;
