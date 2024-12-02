import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import blogService from '../services/blogs';

export const fetchBlogs = createAsyncThunk('blogs/fetchBlogs', async () => {
    const blogs = await blogService.getAll();
    return blogs;
});

export const fetchBlogById = createAsyncThunk(
    'blogs/fetchBlogById',
    async (id, { rejectWithValue }) => {
        try {
            const blog = await blogService.getOne(id);
            return blog;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error || error.message || 'Failed to fetch the blog',
            );
        }
    },
);

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
            return updatedBlog;
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

export const createComment = createAsyncThunk(
    'blogs/createComment',
    async ({ blogId, commentText }, { rejectWithValue }) => {
        try {
            const newComment = await blogService.createComment(blogId, commentText);
            return newComment;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error || error.message || 'Failed to create comment',
            );
        }
    },
);

const blogSlice = createSlice({
    name: 'blogs',
    initialState: {
        blogs: [],
        selectedBlog: { comments: [] },
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
            // fetch all blogs
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

            // fetch only one blog
            .addCase(fetchBlogById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchBlogById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.selectedBlog = action.payload;
            })
            .addCase(fetchBlogById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            // create new blog
            .addCase(createBlog.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.blogs.push(action.payload);
            })
            .addCase(createBlog.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            // remove blog
            .addCase(removeBlog.fulfilled, (state, action) => {
                state.blogs = state.blogs.filter((blog) => blog.id !== action.payload);
            })
            .addCase(removeBlog.rejected, (state, action) => {
                state.error = action.payload;
            })

            // update likes on blog
            .addCase(updateBlogLikes.fulfilled, (state, action) => {
                if (state.selectedBlog?.id === action.payload.id) {
                    state.selectedBlog.likes = action.payload.likes;
                }

                const index = state.blogs.findIndex(blog => blog.id === action.payload.id);
                if (index !== -1) {
                    state.blogs[index].likes = action.payload.likes;
                }
            })
            .addCase(createComment.fulfilled, (state, action) => {
                if (state.selectedBlog.id === action.payload.blogId) {
                    state.selectedBlog.comments = [...state.selectedBlog.comments, action.payload];
                }
            });

    },
});

export const { sortBlogs } = blogSlice.actions;

export default blogSlice.reducer;
