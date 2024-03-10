import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { addBooksAsync } from '../app/slices/booksSlice';
import './pagenation.scss';

function Pagnation(props) {
  const [page, setPage] = useState(1);
  const books = useSelector(state => state.books.books);
  const { setDisplyBooks } = props;
  const dispatch = useDispatch();

  const prevPage = () => {
    const prevPageNum = page - 1;
    if (prevPageNum < 1) return;

    const prevPageBooks = books.slice(10 * (prevPageNum - 1), 10 * prevPageNum);
    setPage(prevPageNum);
    setDisplyBooks(prevPageBooks);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const nextPage = () => {
    const nextPageNum = page + 1;
    if (books.length >= 10 * nextPageNum) {
      const nextPageBooks = books.slice(
        10 * (nextPageNum - 1),
        10 * nextPageNum
      );
      setPage(nextPageNum);
      setDisplyBooks(nextPageBooks);
    } else {
      setPage(nextPageNum);
      dispatch(addBooksAsync());
    }
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const currentPageBooks = books.slice(10 * (page - 1), 10 * page);
    setDisplyBooks(currentPageBooks);
  }, [books]);

  return (
    <div className="pagenation">
      <div className="pagenation-body">
        <FontAwesomeIcon
          className={
            page > 1
              ? 'pagenation-body__icon'
              : 'pagenation-body__icon--invalid'
          }
          icon={faChevronLeft}
          onClick={() => {
            if (page <= 1) return;
            prevPage();
          }}
        />
        <p className="pagenation-body__text">{page}</p>
        <FontAwesomeIcon
          className="pagenation-body__icon"
          icon={faChevronRight}
          onClick={() => nextPage()}
        />
      </div>
    </div>
  );
}

export default Pagnation;
