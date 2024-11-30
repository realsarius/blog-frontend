import Button from '../components/Button.jsx';
import Blog from '../components/Blog.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import { fetchBlogs, removeBlog, sortBlogs } from '../reducers/blogSlice.js';
import Togglable from '../components/Togglable.jsx';
import BlogForm from '../components/BlogForm.jsx';


const Home = () => {
    const dispatch = useDispatch();

    const blogs = useSelector((state) => state.blogs.blogs);
    const blogStatus = useSelector((state) => state.blogs.status);
    const error = useSelector((state) => state.blogs.error);

    const blogFormRef = useRef();

    useEffect(() => {
        if (blogStatus === 'idle') {
            dispatch(fetchBlogs());
        }
    }, [dispatch, blogStatus]);


    const handleRemoveBlog = (blogId) => {
        dispatch(removeBlog(blogId));
    };

    const handleSortBlogs = () => {
        dispatch(sortBlogs());
    };


    const addBlogForm = () => (
        <Togglable buttonLabel="add new blog" ref={blogFormRef}>
            <BlogForm
                blogs={blogs}
                blogFormRef={blogFormRef}
            />
        </Togglable>
    );

    return (
        <div>

            <h2>create new</h2>
            {addBlogForm()}

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
        </div>
    );
};

export default Home;