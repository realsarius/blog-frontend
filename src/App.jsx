import Notification from './components/Notification.jsx';
import Footer from './components/Footer.jsx';
import {
    Routes, Route, Link,
} from 'react-router-dom';
import Home from './pages/Home.jsx';
import Users from './pages/Users.jsx';
import Button from './components/Button.jsx';
import { useDispatch, useSelector } from 'react-redux';
import Togglable from './components/Togglable.jsx';
import LoginForm from './components/LoginForm.jsx';
import { useEffect, useRef, useState } from 'react';
import { loadUserFromLocalStorage, loginUser, logoutUserThunk } from './reducers/userSlice.js';
import { notify } from './reducers/notificationSlice.js';
import User from './pages/User.jsx';

const App = () => {
    const dispatch = useDispatch();

    const user = useSelector((state) => state.user.user);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        dispatch(loadUserFromLocalStorage());
    }, [dispatch]);

    const loginForm = () => {
        return (
            <div>
                <Togglable buttonLabel="login">
                    <LoginForm
                        username={username}
                        password={password}
                        handleUsernameChange={({ target }) => setUsername(target.value)}
                        handlePasswordChange={({ target }) => setPassword(target.value)}
                        handleSubmit={handleLogin}
                    />
                </Togglable>
            </div>
        );
    };


    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const loggedInUser = await dispatch(loginUser({ username, password })).unwrap();

            setUsername('');
            setPassword('');

            dispatch(notify(`Logged in as ${loggedInUser.name}`, 'success'));
        } catch (error) {
            const errorMsg = error.message || 'Unknown error occurred';
            dispatch(notify(errorMsg, 'error'));
        }
    };

    const handleLogout = (event) => {
        event.preventDefault();

        dispatch(logoutUserThunk());
    };

    return (
        <div>
            {/*<Navbar handleLogout={handleLogout} handleLogin={handleLogin} user={user} loginService={loginService}*/}
            <Notification />
            <div>
                <Link to={'/'}>home</Link>
                <Link to={'/users'}>users</Link>
            </div>
            <h2>blogs</h2>
            {!user ? (
                <div>
                    <h2 className={'text-3xl'}>Login</h2>
                    {loginForm()}
                </div>
            ) : (
                <div>
                    <p>{user.name} logged in <Button onClick={handleLogout}>log out</Button></p>
                    {/*<h2>create new</h2>*/}
                    {/*{addBlogForm()}*/}
                </div>
            )}
            <Routes>
                <Route path={'/'} element={<Home />} />
                <Route path={'/users'} element={<Users />} />
                <Route path={'/users/:userId'} element={<User />} />
            </Routes>
            <Footer />
        </div>
    );
};

export default App;
