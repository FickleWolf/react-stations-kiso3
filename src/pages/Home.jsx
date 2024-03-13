import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenNib, faFlag } from '@fortawesome/free-solid-svg-icons';
import Header from '../components/Header';
import Loading from '../components/Loading';
import Pagenaion from '../components/Pagenation';
import './home.scss';

function Home() {
  const navigate = useNavigate();
  const auth = useSelector(state => state.auth.isSignIn);
  const [displyBooks, setDisplyBooks] = useState([]);

  return (
    <div>
      <Header />
      <div className="home">
        <Books books={displyBooks} auth={auth} />
        <Pagenaion setDisplyBooks={setDisplyBooks} />
        {auth ? (
          <div className="float">
            <button
              className="float__button"
              type="button"
              onClick={() => navigate('/new')}
            >
              <FontAwesomeIcon icon={faPenNib} className="float__button-icon" />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Books(props) {
  const { books, auth } = props;
  const navigate = useNavigate();
  if (!books || books.length === 0) return <Loading />;

  return (
    <div className="books">
      {books.map((book, key) => (
        <article
          key={key}
          className="book"
          onClick={() => {
            if (!auth) return;
            navigate(`/detail/${book.id}`);
          }}
        >
          {book.isMine ? (
            <FontAwesomeIcon className="book__ismine" icon={faFlag} />
          ) : null}
          <div className="book__tittle">{book.title}</div>
          <div
            className="book__url"
            onClick={e => {
              e.stopPropagation();
              window.open(book.url, '_blank');
            }}
            role="link"
            tabIndex={0}
          >
            {book.url}
          </div>
          <div className="book__detail">{book.detail}</div>
          <div className="book__reviewer">{book.reviewer}</div>
        </article>
      ))}
    </div>
  );
}

export default Home;
