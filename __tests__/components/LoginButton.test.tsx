/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginButton from '@/components/auth/LoginButton';

// SIMPLE EXPLANATION: Mock the Modal component so we don't need to worry about its complexity
jest.mock('@/components/ui/Modal', () => {
  return function MockModal({ isOpen, onClose, children }: any) {
    // SIMPLE EXPLANATION: If modal should be open, show the children (LoginForm)
    // If not, show nothing. Also show a close button for testing.
    return isOpen ? (
      <div data-testid="modal">
        <button data-testid="close-modal" onClick={onClose}>
          Close
        </button>
        {children}
      </div>
    ) : null;
  };
});

// SIMPLE EXPLANATION: Mock the LoginForm so we focus only on testing LoginButton
jest.mock('@/components/auth/LoginForm', () => {
  return function MockLoginForm() {
    return <div data-testid="login-form">Login Form Content</div>;
  };
});

// SIMPLE EXPLANATION: Mock the styled component
jest.mock('@/styles/components/auth/AuthButton.styles', () => ({
  PrimaryAuthButton: ({ children, onClick }: any) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

describe('LoginButton Component Tests', () => {
  // TEST 1: Component renders correctly
  it('should render the login button', () => {
    // SIMPLE EXPLANATION: Render our component on a fake webpage
    render(<LoginButton />);

    // SIMPLE EXPLANATION: Check if the Login button appears on the page
    const loginButton = screen.getByText('Login');
    expect(loginButton).toBeInTheDocument();
  });

  // TEST 2: Modal doesn't show initially
  it('should not show modal initially', () => {
    render(<LoginButton />);

    // SIMPLE EXPLANATION: Modal should be hidden when page first loads
    const modal = screen.queryByTestId('modal');
    expect(modal).not.toBeInTheDocument();
  });

  // TEST 3: Clicking button opens modal
  it('should open modal when login button is clicked', () => {
    render(<LoginButton />);

    // SIMPLE EXPLANATION: Find the Login button and click it
    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);

    // SIMPLE EXPLANATION: Now the modal should appear
    const modal = screen.getByTestId('modal');
    expect(modal).toBeInTheDocument();

    // SIMPLE EXPLANATION: And the login form should be inside it
    const loginForm = screen.getByTestId('login-form');
    expect(loginForm).toBeInTheDocument();
  });

  // TEST 4: Closing modal hides it
  it('should close modal when close button is clicked', () => {
    render(<LoginButton />);

    // SIMPLE EXPLANATION: First open the modal
    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);

    // SIMPLE EXPLANATION: Confirm modal is open
    expect(screen.getByTestId('modal')).toBeInTheDocument();

    // SIMPLE EXPLANATION: Now close the modal
    const closeButton = screen.getByTestId('close-modal');
    fireEvent.click(closeButton);

    // SIMPLE EXPLANATION: Modal should be gone
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  // TEST 5: Optional onClick prop works
  it('should call onClick prop when provided', () => {
    // SIMPLE EXPLANATION: Create a fake function to track if it gets called
    const mockOnClick = jest.fn();

    render(<LoginButton onClick={mockOnClick} />);

    // SIMPLE EXPLANATION: Click the login button
    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);

    // SIMPLE EXPLANATION: Check that our fake function was called
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  // TEST 6: Multiple clicks work correctly
  it('should handle multiple button clicks', () => {
    const mockOnClick = jest.fn();
    render(<LoginButton onClick={mockOnClick} />);

    const loginButton = screen.getByText('Login');

    // SIMPLE EXPLANATION: Click multiple times
    fireEvent.click(loginButton);
    fireEvent.click(loginButton);
    fireEvent.click(loginButton);

    // SIMPLE EXPLANATION: Should be called 3 times
    expect(mockOnClick).toHaveBeenCalledTimes(3);

    // SIMPLE EXPLANATION: Modal should still be visible (last state)
    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  // TEST 7: Component works without onClick prop
  it('should work fine without onClick prop', () => {
    // SIMPLE EXPLANATION: No onClick prop provided - should not crash
    expect(() => {
      render(<LoginButton />);
    }).not.toThrow();

    // SIMPLE EXPLANATION: Should still be clickable
    const loginButton = screen.getByText('Login');
    expect(() => {
      fireEvent.click(loginButton);
    }).not.toThrow();

    // SIMPLE EXPLANATION: Modal should still open
    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });
});
