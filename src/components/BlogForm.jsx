import { useState } from 'react';
import Button from './Button.jsx';

const BlogForm = ({ blogs, blogService, setBlogs, setMessage, setMessageType }) => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [url, setUrl] = useState('');

    const addBlog = (event) => {
        event.preventDefault();

        const blogObject = {
            title,
            author,
            url,
        };

        blogService.create(blogObject)
            .then(returnedBlog => {
                setBlogs(blogs.concat(returnedBlog));
                setTitle('');
                setAuthor('');
                setUrl('');
                setMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`);
                setMessageType('success');
                setTimeout(() => {
                    setMessage('');
                    setMessageType('');
                }, 5000);
            })
            .catch(error => {
                setMessage(`error: ${error}`);
                setMessageType('error');
                setTimeout(() => {
                    setMessage('');
                    setMessageType('');
                }, 5000);
            });

    };

    return (
        <form onSubmit={addBlog} className="space-y-4 p-6 rounded-lg shadow-md bg-base-200">
            <div className="form-control">
                <label className="label" htmlFor="title">
                    <span className="label-text">Title</span>
                </label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    data-testid="blog-title"
                    placeholder={'Blog Title'}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input input-bordered w-full"
                />
            </div>

            <div className="form-control">
                <label className="label" htmlFor="author">
                    <span className="label-text">Author</span>
                </label>
                <input
                    id="author"
                    type="text"
                    value={author}
                    data-testid="blog-author"
                    onChange={(e) => setAuthor(e.target.value)}
                    className="input input-bordered w-full"
                />
            </div>

            <div className="form-control">
                <label className="label" htmlFor="url">
                    <span className="label-text">URL</span>
                </label>
                <input
                    id="url"
                    type="text"
                    value={url}
                    data-testid="blog-url"
                    onChange={(e) => setUrl(e.target.value)}
                    className="input input-bordered w-full"
                />
            </div>

            <Button type="submit" className="btn btn-primary w-full">Add Blog</Button>
        </form>

    );
};

export default BlogForm;