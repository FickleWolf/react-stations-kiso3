import { useCookies } from 'react-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../app/slices/authSlice';
import { removeUserInfo } from '../app/slices/userInfoSlice';
import './header.scss';

function Header() {
  const auth = useSelector(state => state.auth.isSignIn);
  const userInfo = useSelector(state => state.userInfo.info);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [, , removeCookie] = useCookies();
  const handleSignOut = () => {
    dispatch(signOut());
    dispatch(removeUserInfo());
    removeCookie('token');
    navigate('/login');
  };

  return (
    <header className="header">
      <h1 onClick={() => navigate('/')}>BookReview</h1>
      {auth ? (
        <button
          onClick={handleSignOut}
          className="sign-out-button"
          type="button"
        >
          サインアウト
        </button>
      ) : null}
    </header>
  );
}

export default Header;
