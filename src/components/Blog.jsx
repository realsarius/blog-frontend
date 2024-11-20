import { useState } from 'react';
import Button from './Button.jsx';

const Blog = ({ blog, blogService, onRemove }) => {
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

    const handleRemove = async (event) => {
        event.preventDefault();

        try {
            if (window.confirm(`Are you sure you want to remove the blog "${blog.title}"?`)) {
                await blogService.remove(blog.id);
                onRemove(blog.id);
            }
        } catch (error) {
            console.error('Failed to remove blog:', error);
        }
    };

    // console.log(JSON.parse(localStorage.getItem('loggedBlogappUser')).data.name);

    return (
        <li className={'blog border-2 border-slate-600 rounded w-full sm:w-[80%] p-2'}>
            <span>{blog.title}</span> <Button className={'showDetailsBtn btn'}
                                              onClick={() => setIsDetailsHidden(!isDetailsHidden)}>{isDetailsHidden ? 'show' : 'hide'}</Button>
            {!isDetailsHidden && (
                <div className={'p-4'}>
                    <p>{blog.url}</p>
                    <p>likes {likes} <Button onClick={handleLike} disabled={loading}>like</Button></p>
                    <p>{blog.author}</p>
                    {JSON.parse(localStorage.getItem('loggedBlogappUser')).data.name === blog.author &&
                        <Button onClick={handleRemove}>remove</Button>}
                    {/*<Button onClick={handleRemove}>remove</Button>*/}
                </div>
            )}
        </li>
    );
};

export default Blog;
