import { useState } from 'react';
import Button from './Button.jsx';

const Blog = ({ blog, blogService }) => {
    const [isDetailsHidden, setIsDetailsHidden] = useState(true);
    const [likes, setLikes] = useState(blog.likes);
    const [loading, setLoading] = useState(false);

    const handleLike = async (event) => {
        event.preventDefault();

        const newLikes = likes + 1;

        try {
            setLoading(true);
            await blogService.updateLikes(blog.id, newLikes);
            setLikes(newLikes);
        } catch (error) {
            console.error('Failed to update likes:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <li className={'border-2 border-slate-600 rounded w-full sm:w-[80%] p-2'}>
            {blog.title} <Button
            onClick={() => setIsDetailsHidden(!isDetailsHidden)}>{isDetailsHidden ? 'show' : 'hide'}</Button>
            {!isDetailsHidden && (
                <div className={'p-4'}>
                    <p>{blog.url}</p>
                    <p>likes {likes} <Button onClick={handleLike} disabled={loading}>like</Button></p>
                    <p>{blog.author}</p>
                </div>
            )}
        </li>
    );
};

export default Blog;
