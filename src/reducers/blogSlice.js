import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import blogService from '../services/blogs';

export const fetchBlogs = createAsyncThunk('blogs/fetchBlogs', async () => {
    const blogs = await blogService.getAll();
    return blogs;
});

export const createBlog = createAsyncThunk(
    'blogs/createBlog',
    async (blogObject) => {
        const returnedBlog = await blogService.create(blogObject);
        return returnedBlog;
    },
);

export const updateBlogLikes = createAsyncThunk(
    'blogs/updateBlogLikes',
    async ({ id, likes }, { rejectWithValue }) => {
        try {
            const updatedBlog = await blogService.updateLikes(id, likes);
            return { id: updatedBlog.id, likes: updatedBlog.likes };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error || error.message || 'Failed to update likes',
            );
        }
    },
);

export const removeBlog = createAsyncThunk(
    'blogs/removeBlog',
    async (id, { rejectWithValue }) => {
        try {
            await blogService.remove(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to remove blog');
        }
    },
);

const blogSlice = createSlice({
    name: 'blogs',
    initialState: {
        blogs: [],
        status: 'idle',
        error: null,
    },
    reducers: {
        sortBlogs: (state) => {
            state.blogs = [...state.blogs].sort((a, b) => b.likes - a.likes);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBlogs.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchBlogs.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.blogs = action.payload;
            })
            .addCase(fetchBlogs.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createBlog.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.blogs.push(action.payload);
            })
            .addCase(createBlog.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(updateBlogLikes.fulfilled, (state, action) => {
                const blog = state.blogs.find((blog) => blog.id === action.payload.id);
                if (blog) {
                    blog.likes = action.payload.likes;
                }
            })
            .addCase(removeBlog.fulfilled, (state, action) => {
                // Remove the blog from the state after successful deletion
                state.blogs = state.blogs.filter((blog) => blog.id !== action.payload);
            })
            .addCase(removeBlog.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export const { sortBlogs } = blogSlice.actions;

export default blogSlice.reducer;
