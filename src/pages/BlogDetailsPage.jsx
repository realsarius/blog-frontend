import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createComment, fetchBlogById, updateBlogLikes } from '../reducers/blogSlice.js';
import Button from '../components/Button.jsx';

const BlogDetailsPage = () => {
  const { blogId } = useParams();
  const dispatch = useDispatch();

  const { selectedBlog, status, error } = useSelector((state) => state.blogs);

  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    if (blogId) {
      dispatch(fetchBlogById(blogId));
    }
  }, [dispatch, blogId]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'failed') {
    return <p>Error: {error}</p>;
  }

  const handleAddComment = async (event) => {
    event.preventDefault();
    if (commentText.trim()) {
      await dispatch(createComment({ blogId: selectedBlog.id, commentText }));
      setCommentText('');
      dispatch(fetchBlogById(blogId));
    }
  };

  const handleLike = async () => {
    try {
      setLoading(true);
      await dispatch(updateBlogLikes({ id: selectedBlog.id, likes: selectedBlog.likes + 1 })).unwrap();
    } catch (error) {
      console.error('Error updating likes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {selectedBlog ? (
        <div>
          <h2 className={'text-xl font-semibold'}>{selectedBlog.title}</h2>
          <p>
            {selectedBlog.likes} likes{' '}
            <Button onClick={handleLike} disabled={loading}>
              {loading ? 'Liking...' : 'Like'}
            </Button>
          </p>
          <p>added by {selectedBlog.author}</p>
          <div className={'comment-section'}>
            <h3>comments</h3>
            <form onSubmit={handleAddComment} className="mt-4">
                            <textarea
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              placeholder="Write your comment here..."
                              className="textarea textarea-bordered w-full mb-2"
                              rows="4"
                            />
              <div className="flex justify-end">
                <Button type="submit" disabled={loading || !commentText}>
                  Add Comment
                </Button>
              </div>
            </form>
            <ul className="space-y-4">
              {selectedBlog.comments && selectedBlog.comments.length > 0 ? (
                [...selectedBlog.comments]
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((comment) => (
                    <li key={comment.id} className="p-4 bg-base-200 rounded-lg shadow-lg">
                      <div className="flex items-center space-x-3">
                        <div className="font-semibold">{comment.user.name}</div>
                        <div className="text-sm text-gray-500">
                          <span>{new Date(comment.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                      <p className="mt-2">{comment.text}</p>
                    </li>
                  ))
              ) : (
                <p className="text-center text-gray-500">No comments...</p>
              )}
            </ul>


          </div>

        </div>
      ) : (
        <p>Blog not found</p>
      )}
    </div>
  );
};


export default BlogDetailsPage;
