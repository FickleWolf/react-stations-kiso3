import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRightToBracket,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { signOut } from '../app/slices/authSlice';
import { removeUserInfo } from '../app/slices/userInfoSlice';
import { setBooksAsync } from '../app/slices/booksSlice';
import './header.scss';

function Header() {
  const auth = useSelector(state => state.auth.isSignIn);
  const userInfo = useSelector(state => state.userInfo.info);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [, , removeCookie] = useCookies();
  const handleSignOut = () => {
    dispatch(signOut());
    dispatch(removeUserInfo());
    dispatch(setBooksAsync());
    removeCookie('token');
    navigate('/login');
  };

  useEffect(() => {
    dispatch(setBooksAsync());
  }, [userInfo]);

  const isAuthPage = () => {
    const authPagesPathName = ['/login', '/signup'];
    return authPagesPathName.includes(location.pathname);
  };

  return (
    <header className="header">
      <h1 onClick={() => navigate('/')}>BookReview</h1>
      {!isAuthPage() ? (
        <div className="button-group">
          {auth && userInfo ? (
            <>
              <button
                onClick={() => navigate('/profile')}
                className="button-group__button"
                type="button"
              >
                <img
                  className="button-group__img"
                  src={
                    userInfo.iconUrl
                      ? userInfo.iconUrl
                      : '/user_icon_default.png'
                  }
                  alt="user-icon"
                />
                <span className="button-group__text">{userInfo.name}</span>
              </button>
              <button
                onClick={handleSignOut}
                className="button-group__button"
                type="button"
              >
                <FontAwesomeIcon
                  className="button-group__icon"
                  icon={faRightFromBracket}
                />
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="button-group__button"
              type="button"
            >
              <FontAwesomeIcon
                className="button-group__icon"
                icon={faRightToBracket}
              />
            </button>
          )}
        </div>
      ) : null}
    </header>
  );
}

export default Header;
