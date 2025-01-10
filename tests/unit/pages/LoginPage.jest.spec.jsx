import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import LoginPage from '../../../src/pages/LoginPage.jsx';
import userReducer, { loginUser } from '../../../src/reducers/userSlice.js';
import notificationReducer from '../../../src/reducers/notificationSlice.js';
import { BrowserRouter } from 'react-router-dom';

// Mock the useNavigate hook from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Create a mock store
const createMockStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      user: userReducer,
      notification: notificationReducer,
    },
    preloadedState,
  });
};

describe('LoginPage', () => {
  it('should render the login form correctly', () => {
    render(
      <Provider store={createMockStore()}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </Provider>,
    );

    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  it('should update username and password fields correctly', () => {
    render(
      <Provider store={createMockStore()}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </Provider>,
    );

    const usernameInput = screen.getByTestId('username');
    const passwordInput = screen.getByTestId('password');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: '123456' } });

    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('123456');
  });

  it('should dispatch login action and navigate on successful login', async () => {
    const mockDispatch = jest.fn().mockResolvedValue({ name: 'Test User' });
    const mockNavigate = jest.fn();

    useDispatch.mockReturnValue(mockDispatch);
    useNavigate.mockReturnValue(mockNavigate);

    render(
      <Provider store={createMockStore()}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </Provider>,
    );

    const usernameInput = screen.getByTestId('username');
    const passwordInput = screen.getByTestId('password');
    const submitButton = screen.getByText(/Login/i);

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: '123456' } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockDispatch).toHaveBeenCalledWith(loginUser({
      username: 'testuser',
      password: '123456',
    })));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should display error notification on failed login', async () => {
    const mockDispatch = jest.fn().mockRejectedValue(new Error('Invalid credentials'));
    const mockNavigate = jest.fn();

    useDispatch.mockReturnValue(mockDispatch);
    useNavigate.mockReturnValue(mockNavigate);

    render(
      <Provider store={createMockStore()}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </Provider>,
    );

    const usernameInput = screen.getByTestId('username');
    const passwordInput = screen.getByTestId('password');
    const submitButton = screen.getByText(/Login/i);

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function)));
    expect(screen.getByText(/Invalid credentials/)).toBeInTheDocument();
  });

  it('should display success notification on successful login', async () => {
    const mockDispatch = jest.fn().mockResolvedValue({ name: 'Test User' });
    const mockNavigate = jest.fn();

    useDispatch.mockReturnValue(mockDispatch);
    useNavigate.mockReturnValue(mockNavigate);

    render(
      <Provider store={createMockStore()}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </Provider>,
    );

    const usernameInput = screen.getByTestId('username');
    const passwordInput = screen.getByTestId('password');
    const submitButton = screen.getByText(/Login/i);

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: '123456' } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function)));
    expect(screen.getByText(/Logged in as Test User/)).toBeInTheDocument();
  });
});
