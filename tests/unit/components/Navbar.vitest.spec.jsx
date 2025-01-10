import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { vi } from 'vitest';
import Navbar from '../../../src/components/Navbar';
import store from '../../../src/store/store';
import React from 'react';


describe('Navbar', () => {
  it('should display Login button when user is not logged in', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </Provider>,
    );

    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  it('should display username and Logout button when user is logged in', () => {
    const mockUser = { name: 'Test User', username: 'testuser' };

    store.dispatch({ type: 'user/setUser', payload: mockUser });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </Provider>,
    );

    expect(screen.getByText(/Test User logged in/i)).toBeInTheDocument();
    expect(screen.getByText(/log out/i)).toBeInTheDocument();
  });

  it('should call logoutUserThunk when logout button is clicked', async () => {
    const mockUser = { name: 'Test User', username: 'testuser' };

    const logoutUserThunk = vi.fn();

    store.dispatch({ type: 'user/setUser', payload: mockUser });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </Provider>,
    );

    const logoutButton = screen.getByText(/log out/i);
    fireEvent.click(logoutButton);

    expect(logoutUserThunk).toHaveBeenCalled();
  });

  it('should navigate to users page when Users link is clicked', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </Provider>,
    );

    const usersLink = screen.getByText(/users/i);
    fireEvent.click(usersLink);

    expect(window.location.pathname).toBe('/users');
  });
});
