import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenNib } from '@fortawesome/free-solid-svg-icons';
import Header from '../components/Header';
import Pagenaion from '../components/Pagenation';
import './home.scss';

function Home() {
  const auth = useSelector(state => state.auth.isSignIn);
  const [displyBooks, setDisplyBooks] = useState([]);

  return (
    <div>
      <Header />
      <div className="home">
        <Books books={displyBooks} />
        <Pagenaion setDisplyBooks={setDisplyBooks} />
        {auth ? (
          <div className="float">
            <button className="float__button" type="button">
              <FontAwesomeIcon icon={faPenNib} className="float__button-icon" />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Books(props) {
  const { books } = props;
  const navigate = useNavigate();
  if (!books || books.length === 0) return <p>取得できませんでした。</p>;

  return (
    <div className="books">
      {books.map((book, key) => (
        <article
          key={key}
          className="book"
          onClick={() => navigate(`/detail/${book.id}`)}
        >
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
          <div className="book__review">{book.review}</div>
          <div className="book__reviewer">{book.reviewer}</div>
        </article>
      ))}
    </div>
  );
}

export default Home;
