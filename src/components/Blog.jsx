import { useState } from 'react';
import Button from './Button.jsx';
import { useDispatch } from 'react-redux';
import { removeBlog, sortBlogs, updateBlogLikes } from '../reducers/blogSlice';
import { Link, useLocation } from 'react-router-dom';

const Blog = ({ blog }) => {
    const dispatch = useDispatch();

    const [isDetailsHidden, setIsDetailsHidden] = useState(true);
    const [loading, setLoading] = useState(false);

    const location = useLocation();

    const isInUserRoute = location.pathname.startsWith('/users/');

    const handleLike = async () => {
        try {
            setLoading(true);
            await dispatch(updateBlogLikes({ id: blog.id, likes: blog.likes + 1 })).unwrap();
            dispatch(sortBlogs());
        } catch (error) {
            console.error('Error updating likes:', error);
        } finally {
            setLoading(false);
        }
    };


    const handleRemove = async () => {
        if (window.confirm(`Are you sure you want to remove the blog "${blog.title}"?`)) {
            try {
                setLoading(true);
                await dispatch(removeBlog(blog.id)).unwrap();
                dispatch(sortBlogs());
            } catch (error) {
                console.error('Failed to remove blog:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <li className={'blog border-2 border-slate-600 rounded w-full sm:w-[80%] p-2'}>
            <span className={'text-xl font-semibold'}><Link to={`/blogs/${blog.id}`}>{blog.title}</Link></span>
            {/*<Button*/}
            {/*    className={'showDetailsBtn btn'}*/}
            {/*    onClick={() => setIsDetailsHidden(!isDetailsHidden)}>{isDetailsHidden ? 'show' : 'hide'}</Button>*/}
            {/*{!isDetailsHidden && (*/}
            {/*    <div className={'p-4'}>*/}
            {/*        <p>{blog.url}</p>*/}
            {/*        <p>likes {blog.likes} <Button onClick={handleLike} disabled={loading}>like</Button></p>*/}
            {/*        <p>added by {blog.author}</p>*/}
            {/*        {isInUserRoute && (*/}
            {/*            <Button onClick={handleRemove}>remove</Button>*/}
            {/*        )}*/}
            {/*    </div>*/}
            {/*)}*/}
        </li>
    );
};

export default Blog;
