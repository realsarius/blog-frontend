import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import loginService from '../services/login';
import { notify } from './notificationSlice.js';
import blogService from '../services/blogs';
import userService from '../services/users';

export const fetchUsers = createAsyncThunk(
  'user/fetchUsers',
  async () => {
    const users = await userService.getAll();
    return users;
  },
);

export const fetchUserById = createAsyncThunk('user/fetchUserById', async (userId) => {
  const response = await blogService.getUserById(userId); // Assuming this endpoint exists
  return response;
});

export const loadUserFromLocalStorage = createAsyncThunk(
  'user/loadUserFromLocalStorage',
  async (_, { dispatch }) => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);

      blogService.setToken(user.token);

      dispatch(setUser(user));

      return user;
    }
    return null;
  },
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (credentials) => {
    const user = await loginService.login(credentials);
    // console.log(user.data);
    window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user.data));

    return user.data;
  },
);

export const logoutUserThunk = createAsyncThunk(
  'user/logoutUser',
  async (_, { dispatch }) => {
    window.localStorage.removeItem('loggedBlogappUser');

    dispatch(notify('You are successfully logged out.', 'success'));

    return null;
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    users: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logoutUser: (state) => {
      state.user = null;
      window.localStorage.removeItem('loggedBlogappUser');
      blogService.setToken(null);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchUserById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Ensure that the user data is added to the users array
        const existingUser = state.users.find((user) => user.id === action.payload.id);
        if (!existingUser) {
          state.users.push(action.payload);
        }
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setUser, logoutUser } = userSlice.actions;

export default userSlice.reducer;
