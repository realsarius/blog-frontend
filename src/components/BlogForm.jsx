import { useState } from 'react';
import Button from './Button.jsx';
import { useDispatch } from 'react-redux';
import { notify } from '../reducers/notificationSlice.js';
import { createBlog } from '../reducers/blogSlice.js';

const BlogForm = ({ blogFormRef }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const dispatch = useDispatch();

  const addBlog = async (event) => {
    event.preventDefault();

    const blogObject = {
      title,
      author,
      url,
    };

    try {
      const returnedBlog = await dispatch(createBlog(blogObject)).unwrap();

      dispatch(notify(`A new blog "${returnedBlog.title}" by ${returnedBlog.author} added`, 'success'));

      setTitle('');
      setAuthor('');
      setUrl('');

      if (blogFormRef.current) {
        blogFormRef.current.toggleVisibility();
      }

    } catch (error) {

      dispatch(notify(`Error: ${error.message}`, 'error'));
    }
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
          placeholder={'BlogDetailsPage Title'}
          onChange={(e) => setTitle(e.target.value)}
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