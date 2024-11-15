import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog.jsx';
import { vi } from 'vitest';

describe('Blog component', () => {
    const blog = {
        id: '1',
        title: 'My test blog title',
        author: 'Mr. Tester',
        url: 'https://www.testingmyblogapp.com',
        likes: 34,
    };

    const blogService = {
        updateLikes: vi.fn(),
        remove: vi.fn(),
    };

    const onRemove = vi.fn();

    beforeAll(() => {
        console.error = vi.fn();
    });

    beforeEach(() => {
        blogService.updateLikes.mockClear();
        blogService.remove.mockClear();
        console.error.mockClear();
    });

    describe('Rendering and toggling details', () => {
        test('renders blog title and toggles details', async () => {
            const { container } = render(
                <Blog blog={blog} blogService={blogService} onRemove={onRemove} />,
            );

            expect(screen.getByText('My test blog title')).toBeDefined();
            expect(screen.queryByText(blog.url)).toBeNull();

            const user = userEvent.setup();
            const showDetailsBtn = container.querySelector('.showDetailsBtn');
            await user.click(showDetailsBtn);
            expect(screen.getByText(blog.url)).toBeDefined();
        });
    });

    describe('Liking functionality', () => {
        test('calls blogService.updateLikes when the like button is clicked', async () => {
            render(<Blog blog={blog} blogService={blogService} onRemove={onRemove} />);

            const user = userEvent.setup();
            await user.click(screen.getByText('show'));

            const likeButton = screen.getByText('like');
            await user.click(likeButton);

            expect(blogService.updateLikes).toHaveBeenCalledTimes(1);
            expect(blogService.updateLikes).toHaveBeenCalledWith(blog.id, blog.likes + 1);
        });

        test('logs error if blogService.updateLikes fails', async () => {
            blogService.updateLikes.mockRejectedValue(new Error('Update failed'));

            render(<Blog blog={blog} blogService={blogService} onRemove={onRemove} />);

            const user = userEvent.setup();
            await user.click(screen.getByText('show'));

            const likeButton = screen.getByText('like');
            await user.click(likeButton);

            expect(blogService.updateLikes).toHaveBeenCalled();
            expect(console.error).toHaveBeenCalledWith('Failed to update likes:', expect.any(Error));
        });
    });

    describe('Removing functionality', () => {
        test('calls blogService.remove and onRemove when the remove button is clicked', async () => {
            render(<Blog blog={blog} blogService={blogService} onRemove={onRemove} />);

            const user = userEvent.setup();
            await user.click(screen.getByText('show'));

            vi.spyOn(window, 'confirm').mockReturnValueOnce(true);
            const removeButton = screen.getByText('remove');
            await user.click(removeButton);

            expect(blogService.remove).toHaveBeenCalledTimes(1);
            expect(blogService.remove).toHaveBeenCalledWith(blog.id);
            expect(onRemove).toHaveBeenCalledTimes(1);
            expect(onRemove).toHaveBeenCalledWith(blog.id);
        });

        test('logs error if blogService.remove fails', async () => {
            blogService.remove.mockRejectedValue(new Error('Remove failed'));

            render(<Blog blog={blog} blogService={blogService} onRemove={onRemove} />);

            const user = userEvent.setup();
            await user.click(screen.getByText('show'));

            vi.spyOn(window, 'confirm').mockReturnValueOnce(true);
            const removeButton = screen.getByText('remove');
            await user.click(removeButton);

            expect(blogService.remove).toHaveBeenCalled();
            expect(console.error).toHaveBeenCalledWith('Failed to remove blog:', expect.any(Error));
        });
    });
});
