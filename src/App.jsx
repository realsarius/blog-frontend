import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import Notification from './components/Notification.jsx';
import Footer from './components/Footer.jsx';
import LoginForm from './components/LoginForm.jsx';
import Togglable from './components/Togglable.jsx';
import Button from './components/Button.jsx';
import BlogForm from './components/BlogForm.jsx';
import Navbar from './components/Navbar.jsx';

const App = () => {
    const [blogs, setBlogs] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [user, setUser] = useState(null);

    const blogFormRef = useRef();

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON);
            setUser(user);
            blogService.setToken(user.token);
        }
    }, []);

    useEffect(() => {
        blogService.getAll().then(blogs => setBlogs(blogs));
    }, []);

    useEffect(() => {
        if (message) {
            console.log('Message set:', message);
        }
    }, [message]);

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
                setBlogs={setBlogs}
                setMessage={setMessage}
                setMessageType={setMessageType}
                blogs={blogs}
                blogService={blogService}
            />
        </Togglable>
    );

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const user = await loginService.login({
                username,
                password,
            });

            window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));

            blogService.setToken(user.data.token);

            setUser(user);
            setUsername('');
            setPassword('');

            setMessage('You are logged in!');
            setMessageType('success');
            setTimeout(() => {
                setMessage('');
                setMessageType('');
            }, 5000);

        } catch (error) {
            const errorMsg = error.response?.data?.error || error.message || 'Unknown error occurred';
            setMessage(errorMsg);
            setMessageType('error');
            setTimeout(() => {
                setMessage('');
                setMessageType('');
            }, 5000);
        }
    };

    const handleLogout = (event) => {
        event.preventDefault();

        window.localStorage.removeItem('loggedBlogappUser');

        setMessage('You are successfully logged out.');
        setMessageType('success');
        setTimeout(() => {
            setMessage('');
            setMessageType('');
        }, 5000);

        setUser(null);
    };

    const handleRemoveBlog = (blogId) => {
        setBlogs(blogs.filter(blog => blog.id !== blogId));
    };

    return (
        <div>
            <Navbar handleLogout={handleLogout} handleLogin={handleLogin} user={user} loginService={loginService}
                    blogService={blogService} setMessage={setMessage} setMessageType={setMessageType} />
            {message && <Notification message={message} messageType={messageType} />}
            <h2>blogs</h2>
            {!user ? (
                <div>
                    <h2 className={'text-3xl'}>Login</h2>
                    {loginForm()}
                </div>
            ) : (
                <div>
                    <p>{user.data.name} logged in <Button onClick={handleLogout}>log out</Button></p>
                    <h2>create new</h2>
                    {addBlogForm()}
                </div>
            )}

            <br />

            <ul className={'flex flex-col gap-4 items-center'}>
                {blogs && blogs
                    .sort((a, b) => b.likes - a.likes)
                    .map(blog => (
                        <Blog
                            key={blog.id}
                            blog={blog}
                            blogService={blogService}
                            onRemove={handleRemoveBlog}
                        />
                    ))}
            </ul>

            <Footer />
        </div>
    );
};

export default App;
