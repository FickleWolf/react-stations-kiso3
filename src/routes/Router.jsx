import { useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';
import LogIn from '../pages/LogIn';
import SignUp from '../pages/SignUp';
import Detail from '../pages/Detail';
import Edit from '../pages/Edit';
import Profile from '../pages/Profile';
import New from '../pages/New';

function Router() {
  const auth = useSelector(state => state.auth.isSignIn);

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/signup" element={<SignUp />} />
        <Route exact path="/login" element={<LogIn />} />
        {auth ? (
          <>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/edit/:id" element={<Edit />} />
            <Route exact path="/profile" element={<Profile />} />
            <Route exact path="/new" element={<New />} />
            <Route exact path="/detail/:id" element={<Detail />} />
          </>
        ) : (
          <Route
            path="/"
            element={auth ? <Home /> : <Navigate replace to="/login" />}
          />
        )}
        <Route element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
