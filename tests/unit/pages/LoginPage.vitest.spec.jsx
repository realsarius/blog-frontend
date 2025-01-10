import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '../../../src/pages/LoginPage';
import { loginUser } from '../../../src/reducers/userSlice';
import { notify } from '../../../src/reducers/notificationSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { vi } from 'vitest';

vi.mock('react-redux', () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

vi.mock('../../reducers/userSlice', () => ({
  loginUser: vi.fn(),
}));

vi.mock('../../reducers/notificationSlice', () => ({
  notify: vi.fn(),
}));

describe('LoginPage', () => {
  let dispatch, navigate;

  beforeEach(() => {
    // Setup mocks
    dispatch = vi.fn();
    navigate = vi.fn();
    useDispatch.mockReturnValue(dispatch);
    useNavigate.mockReturnValue(navigate);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form correctly', () => {
    render(<LoginPage />);

    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  it('handles login form submission successfully', async () => {
    const mockUser = { name: 'John Doe' };
    loginUser.mockResolvedValue(mockUser);

    render(<LoginPage />);

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });

    userEvent.type(usernameInput, 'john_doe');
    userEvent.type(passwordInput, 'password123');

    fireEvent.click(loginButton);

    await waitFor(() => expect(dispatch).toHaveBeenCalledWith(loginUser({
      username: 'john_doe',
      password: 'password123',
    })));
    await waitFor(() => expect(dispatch).toHaveBeenCalledWith(notify('Logged in as John Doe', 'success')));
    expect(navigate).toHaveBeenCalledWith('/');
  });

  it('handles login failure and shows error notification', async () => {
    const errorMessage = 'Invalid credentials';
    loginUser.mockRejectedValue(new Error(errorMessage));

    render(<LoginPage />);

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });

    userEvent.type(usernameInput, 'wrong_user');
    userEvent.type(passwordInput, 'wrong_password');

    fireEvent.click(loginButton);

    await waitFor(() => expect(dispatch).toHaveBeenCalledWith(loginUser({
      username: 'wrong_user',
      password: 'wrong_password',
    })));
    await waitFor(() => expect(dispatch).toHaveBeenCalledWith(notify(errorMessage, 'error')));
  });
});
