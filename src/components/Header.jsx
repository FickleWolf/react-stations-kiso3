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
import { setUserInfoAsync, removeUserInfo } from '../app/slices/userInfoSlice';
import { setBooksAsync } from '../app/slices/booksSlice';
import './header.scss';

function Header() {
  const auth = useSelector(state => state.auth.isSignIn);
  const userInfo = useSelector(state => state.userInfo.info);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cookies, , removeCookie] = useCookies();
  const handleSignOut = () => {
    dispatch(signOut());
    dispatch(removeUserInfo());
    removeCookie('token');
    navigate('/login');
  };

  useEffect(() => {
    const { token } = cookies;
    dispatch(setUserInfoAsync(token));
    dispatch(setBooksAsync(token));
  }, [cookies]);

  return (
    <header className="header">
      <h1 onClick={() => navigate('/')}>BookReview</h1>
      <ButtonGroup
        auth={auth}
        userInfo={userInfo}
        handleSignOut={handleSignOut}
      />
    </header>
  );
}

function ButtonGroup(props) {
  const { auth, userInfo, handleSignOut } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthPage = () => {
    const authPagesPathName = ['/login', '/signup'];
    return authPagesPathName.includes(location.pathname);
  };

  if (!isAuthPage()) {
    return (
      <div className="button-group">
        {auth && userInfo ? (
          <>
            <button
              onClick={() => navigate('/profile')}
              className="button-group__button"
              type="button"
              aria-label="link to mypage"
            >
              <img
                className="button-group__img"
                src={
                  userInfo.iconUrl ? userInfo.iconUrl : '/user_icon_default.png'
                }
                alt="user-icon"
              />
              <span className="button-group__text">{userInfo.name}</span>
            </button>
            <button
              onClick={handleSignOut}
              className="button-group__button"
              type="button"
              aria-label="sign out"
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
            aria-label="sign in"
          >
            <FontAwesomeIcon
              className="button-group__icon"
              icon={faRightToBracket}
            />
          </button>
        )}
      </div>
    );
  }
}

export default Header;
