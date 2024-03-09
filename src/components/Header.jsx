import { useCookies } from 'react-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket, faRightFromBracket } from "@fortawesome/free-solid-svg-icons"
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
      <div className='header__button-group'>
        {auth && userInfo ? (
          <>
            <button
              onClick={() => navigate("/pofile")}
              className="header__button-group__button"
              type="button"
            >
              {userInfo.name}
            </button>
            <button
              onClick={handleSignOut}
              className="header__button-group__button"
              type="button"
            >
              <FontAwesomeIcon icon={faRightFromBracket} />
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="header__button-group__button"
            type="button"
          >
            <FontAwesomeIcon icon={faRightToBracket} />
          </button>
        )}
      </div>
    </header >
  );
}

export default Header;
