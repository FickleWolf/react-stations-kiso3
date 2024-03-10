import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addBooksAsync } from '../app/slices/booksSlice';
import Header from '../components/Header';
import './home.scss';

function Home() {
  const books = useSelector(state => state.books.books);
  const dispatch = useDispatch();

  return (
    <div>
      <Header />
      <div className="home">
        <Books books={books} />
        <button
          onClick={() => {
            dispatch(addBooksAsync());
          }}
          type="button"
        >
          もっとみる
        </button>
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
        <div key={key} className="books-item">
          <article
            className="book-item-link"
            onClick={() => navigate(`/detail/${book.id}`)}
          >
            <div className="book-item-link-item">
              <span className="book-item-link-item__tittle">{book.title}</span>
            </div>
            <div className="book-item-link-item">
              URL:
              <a href={book.url} className="book-item-link-item__url">
                {book.url}
              </a>
            </div>
            <div className="book-item-link-item">
              レビュワー:
              <span className="book-item-link-item__reviewer">
                {book.reviewer}
              </span>
            </div>
            <div className="book-item-link-item">
              <span className="book-item-link-item__review">{book.review}</span>
            </div>
          </article>
        </div>
      ))}
    </div>
  );
}

export default Home;
