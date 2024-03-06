import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './header.scss';
import Header from '../components/Header';
import './home.scss';

function Home() {
  const books = useSelector(state => state.books.books);

  return (
    <div>
      <Header />
      <div className="home">
        <Books books={books} />
      </div>
    </div>
  );
}

function Books(props) {
  const { books } = props;
  if (books.length === 0) return <p>取得できませんでした。</p>;

  return (
    <div className="books">
      {books.map((book, key) => (
        <div key={key} className="books-item">
          <Link to={`/detail/${book.id}`} className="book-item-link">
            <div className="book-item-link-item">
              <span className="book-item-link-item__tittle">{book.title}</span>
            </div>
            <div className="book-item-link-item">
              URL:<a className="book-item-link-item__url">{book.url}</a>
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
          </Link>
        </div>
      ))}
    </div>
  );
}

export default Home;
