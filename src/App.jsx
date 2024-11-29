import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Blog from './components/Blog';
import Notification from './components/Notification.jsx';
import Footer from './components/Footer.jsx';
import LoginForm from './components/LoginForm.jsx';
import Togglable from './components/Togglable.jsx';
import Button from './components/Button.jsx';
import BlogForm from './components/BlogForm.jsx';
import Navbar from './components/Navbar.jsx';
import { notify } from './reducers/notificationSlice.js';
import { fetchBlogs, removeBlog, sortBlogs } from './reducers/blogSlice.js';
import { loadUserFromLocalStorage, loginUser, logoutUserThunk } from './reducers/userSlice.js';  // Import removeBlog action

const App = () => {
    const dispatch = useDispatch();

    const blogs = useSelector((state) => state.blogs.blogs);
    const blogStatus = useSelector((state) => state.blogs.status);
    const error = useSelector((state) => state.blogs.error);

    const user = useSelector((state) => state.user.user);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const blogFormRef = useRef();

    useEffect(() => {
        dispatch(loadUserFromLocalStorage());
    }, [dispatch]);

    useEffect(() => {
        if (blogStatus === 'idle') {
            dispatch(fetchBlogs());
        }
    }, [dispatch, blogStatus]);

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

    const addBlogForm = () => (
        <Togglable buttonLabel="add new blog" ref={blogFormRef}>
            <BlogForm
                blogs={blogs}
                blogFormRef={blogFormRef}
            />
        </Togglable>
    );

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

    const handleRemoveBlog = (blogId) => {
        dispatch(removeBlog(blogId));
    };

    const handleSortBlogs = () => {
        dispatch(sortBlogs());
    };

    return (
        <div>
            {/*<Navbar handleLogout={handleLogout} handleLogin={handleLogin} user={user} loginService={loginService}*/}
            <Notification />
            <h2>blogs</h2>
            {!user ? (
                <div>
                    <h2 className={'text-3xl'}>Login</h2>
                    {loginForm()}
                </div>
            ) : (
                <div>
                    <p>{user.name} logged in <Button onClick={handleLogout}>log out</Button></p>
                    <h2>create new</h2>
                    {addBlogForm()}
                </div>
            )}

            <br />

            {blogStatus === 'loading' ? (
                <p>Loading blogs...</p>
            ) : blogStatus === 'failed' ? (
                <p>{error}</p>
            ) : (
                <>
                    <Button onClick={handleSortBlogs}>Sort Blogs</Button>
                    <ul className={'flex flex-col gap-4 items-center'}>
                        {blogs.map(blog => (
                            <Blog
                                key={blog.id}
                                blog={blog}
                                onRemove={handleRemoveBlog}
                            />
                        ))}
                    </ul>
                </>
            )}

            <Footer />
        </div>
    );
};

export default App;
