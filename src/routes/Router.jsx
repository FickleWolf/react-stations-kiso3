import { useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';
import LogIn from '../pages/LogIn';
import SignUp from '../pages/SignUp';

function Router() {
  const auth = useSelector(state => state.auth.isSignIn);

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/signup" element={<SignUp />} />
        <Route exact path="/login" element={<LogIn />} />
        {auth ? (
          <Route exact path="/" element={<Home />} />
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
