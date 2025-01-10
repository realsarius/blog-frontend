import Notification from './components/Notification.jsx';
import Footer from './components/Footer.jsx';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import UsersPage from './pages/UsersPage.jsx';
import { useDispatch } from 'react-redux';
import React, { useEffect } from 'react';
import { loadUserFromLocalStorage } from './reducers/userSlice.js';
import UserPage from './pages/UserPage.jsx';
import Navbar from './components/Navbar.jsx';
import BlogDetailsPage from './pages/BlogDetailsPage.jsx';
import LoginPage from './pages/LoginPage.jsx';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUserFromLocalStorage());
  }, [dispatch]);

  return (
    <div className={'container mx-auto'}>
      <Navbar />
      <Notification />

      <Routes>
        <Route path={'/'} element={<HomePage />} />
        <Route path={'/login'} element={<LoginPage />} />
        <Route path={'/users'} element={<UsersPage />} />
        <Route path={'/users/:userId'} element={<UserPage />} />
        <Route path={'/blogs/:blogId'} element={<BlogDetailsPage />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
