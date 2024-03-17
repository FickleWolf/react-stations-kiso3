import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPenToSquare,
  faTrashCan,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { setBooksAsync } from '../app/slices/booksSlice';
import Header from '../components/Header';
import Loading from '../components/Loading';
import baseUrl from '../const';
import './detail.scss';

function Detail() {
  const { id } = useParams();
  const auth = useSelector(state => state.auth.isSignIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [book, setBook] = useState(undefined);
  const [cookies, ,] = useCookies();
  const [errorMessage, setErrorMessge] = useState();
  const [isDisplyCaution, setIsDisplyCaution] = useState(false);

  useEffect(() => {
    const { token } = cookies;
    if (!id || !token) {
      navigate('/');
      return;
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
      })
      .catch(err => {
        setErrorMessge(`取得に失敗しました。 ${err}`);
      });
  }, []);

  const deleteReview = () => {
    const { token } = cookies;
    axios
      .delete(`${baseUrl}/books/${id}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        dispatch(setBooksAsync(token));
        navigate('/');
      })
      .catch(err => {
        setIsDisplyCaution(false);
        setErrorMessge(`削除に失敗しました。 ${err}`);
      });
  };

  if (!auth) return <Navigate to="/" />;
  return (
    <div>
      <Header />
      {errorMessage !== '' ? (
        <p className="error-message" role="alert">
          {errorMessage}
        </p>
      ) : null}
      {book ? (
        <main className="detail">
          <Dialog
            isDisplyCaution={isDisplyCaution}
            setIsDisplyCaution={setIsDisplyCaution}
            deleteReview={deleteReview}
          />
          <h2>書籍レビュー詳細</h2>
          <div className="detail-body">
            <label className="title-label">
              タイトル
              <br />
              <div className="title-text">{book.title}</div>
            </label>
            <br />
            <label className="review-label">
              レビュワー
              <br />
              <div className="reviewer-text">{book.reviewer}</div>
            </label>
            <br />
            <label className="url-label">
              URL
              <br />
              <div
                className="url-text"
                onClick={() => {
                  window.open(book.url, '_blank');
                }}
                role="link"
                tabIndex={0}
              >
                {book.url}
              </div>
            </label>
            <br />
            <label className="detail-label">
              詳細
              <br />
              <div className="detail-text">{book.detail}</div>
            </label>
            <br />
            <label className="review-label">
              レビュー
              <br />
              <div className="review-text">{book.review}</div>
            </label>
          </div>
          {book.isMine ? (
            <div className="float">
              <button
                className="float__button"
                type="button"
                onClick={() => navigate(`/edit/${book.id}`)}
                aria-label="link to edit page"
              >
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  className="float__button-icon"
                />
              </button>
              <button
                className="float__button float__button--grey"
                type="button"
                onClick={() => setIsDisplyCaution(true)}
              >
                <FontAwesomeIcon
                  icon={faTrashCan}
                  className="float__button-icon"
                  aria-label="delete"
                />
              </button>
            </div>
          ) : null}
        </main>
      ) : (
        <Loading />
      )}
    </div>
  );
}

function Dialog(props) {
  const { isDisplyCaution, setIsDisplyCaution, deleteReview } = props;
  if (isDisplyCaution) {
    return (
      <div className="dialog">
        <div className="dialog-body">
          <button
            className="dialog-body__icon"
            type="button"
            onClick={() => {
              setIsDisplyCaution(false);
            }}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
          <h3 className="dialog-body__title">書籍レビューの削除</h3>
          <p className="dialog-body__text">
            現在表示されている書籍レビューを削除します。
            削除した投稿はもとに戻すことはできません。
          </p>
          <button
            className="dialog-body__button"
            type="button"
            onClick={() => {
              deleteReview();
            }}
          >
            削除
          </button>
        </div>
      </div>
    );
  }
}

export default Detail;
