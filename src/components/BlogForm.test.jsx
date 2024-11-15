import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogForm from './BlogForm.jsx';
import { vi } from 'vitest';

test('<BlogForm /> calls blogService.create and updates state', async () => {
    const blogService = { create: vi.fn() };
    const setBlogs = vi.fn();
    const setMessage = vi.fn();
    const setMessageType = vi.fn();
    const blogs = [];

    const mockBlog = {
        title: 'My test blog title',
        author: 'Mr. Tester',
        url: 'https://www.testingmyblogapp.com',
    };

    blogService.create.mockResolvedValue(mockBlog);

    render(
        <BlogForm
            setBlogs={setBlogs}
            setMessage={setMessage}
            setMessageType={setMessageType}
            blogs={blogs}
            blogService={blogService}
        />,
    );

    const user = userEvent.setup();

    const titleInput = screen.getByPlaceholderText('Blog Title');
    const authorInput = screen.getByLabelText('Author');
    const urlInput = screen.getByLabelText('URL');
    const sendButton = screen.getByText('Add Blog');

    await user.type(titleInput, mockBlog.title);
    await user.type(authorInput, mockBlog.author);
    await user.type(urlInput, mockBlog.url);
    await user.click(sendButton);

    expect(blogService.create).toHaveBeenCalledTimes(1);
    expect(blogService.create).toHaveBeenCalledWith(mockBlog);

    expect(setBlogs).toHaveBeenCalledWith(blogs.concat(mockBlog));
    expect(setMessage).toHaveBeenCalledWith(`a new blog ${mockBlog.title} by ${mockBlog.author} added`);
    expect(setMessageType).toHaveBeenCalledWith('success');

    console.log(blogService.create.mock.calls);

});
