import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import UserStatusCard from '@/components/ui/UserStatusCard';

// Mock the API
jest.mock('@/server/api', () => ({
  api: {
    users: {
      getProfile: jest.fn(),
    },
  },
}));

// Mock dependencies
jest.mock('next-auth/react');
jest.mock('swr');
jest.mock('@/components/ui/forms/ExpertApplicationForm', () => {
  return function MockExpertApplicationForm({ onSubmit, onCancel }: any) {
    return (
      <div data-testid="expert-form">
        <button onClick={() => onSubmit('test data')}>Submit Application</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    );
  };
});

const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;
const mockUseSWR = useSWR as jest.MockedFunction<typeof useSWR>;

describe('UserStatusCard Component', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'USER' as const,
  };

  const mockSession = {
    user: mockUser,
    expires: '2024-12-31',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSession.mockReturnValue({
      data: mockSession,
      status: 'authenticated',
      update: jest.fn(),
    });
  });

  describe('User Role Display', () => {
    it('displays USER status correctly', () => {
      mockUseSWR.mockReturnValue({
        data: { role: 'USER', isEmailVerified: true },
        error: null,
        isLoading: false,
        mutate: jest.fn(),
      });

      render(<UserStatusCard />);

      expect(screen.getByText('Account Status')).toBeInTheDocument();
      expect(screen.getByText(/regular user/i)).toBeInTheDocument();
    });

    it('displays EXPERT status correctly', () => {
      mockUseSWR.mockReturnValue({
        data: { role: 'EXPERT', isEmailVerified: true },
        error: null,
        isLoading: false,
        mutate: jest.fn(),
      });

      render(<UserStatusCard />);

      expect(screen.getByText(/expert user/i)).toBeInTheDocument();
    });

    it('displays ADMIN status correctly', () => {
      mockUseSWR.mockReturnValue({
        data: { role: 'ADMIN', isEmailVerified: true },
        error: null,
        isLoading: false,
        mutate: jest.fn(),
      });

      render(<UserStatusCard />);

      expect(screen.getByText(/administrator/i)).toBeInTheDocument();
    });
  });

  describe('Email Verification Status', () => {
    it('shows verified email status', () => {
      mockUseSWR.mockReturnValue({
        data: { role: 'USER', isEmailVerified: true },
        error: null,
        isLoading: false,
        mutate: jest.fn(),
      });

      render(<UserStatusCard />);

      expect(screen.getByText(/email verified/i)).toBeInTheDocument();
      expect(screen.getByText('✅')).toBeInTheDocument();
    });

    it('shows unverified email status with verify button', () => {
      mockUseSWR.mockReturnValue({
        data: { role: 'USER', isEmailVerified: false },
        error: null,
        isLoading: false,
        mutate: jest.fn(),
      });

      render(<UserStatusCard />);

      expect(screen.getByText(/email not verified/i)).toBeInTheDocument();
      expect(screen.getByText('❌')).toBeInTheDocument();
      expect(screen.getByText(/verify email/i)).toBeInTheDocument();
    });
  });

  describe('Expert Application', () => {
    it('shows apply for expert button for regular users', () => {
      mockUseSWR.mockReturnValue({
        data: { role: 'USER', isEmailVerified: true },
        error: null,
        isLoading: false,
        mutate: jest.fn(),
      });

      render(<UserStatusCard />);

      expect(screen.getByText(/apply for expert status/i)).toBeInTheDocument();
    });

    it('does not show apply button for experts or admins', () => {
      mockUseSWR.mockReturnValue({
        data: { role: 'EXPERT', isEmailVerified: true },
        error: null,
        isLoading: false,
        mutate: jest.fn(),
      });

      render(<UserStatusCard />);

      expect(screen.queryByText(/apply for expert status/i)).not.toBeInTheDocument();
    });

    it('opens expert application form when apply button is clicked', async () => {
      mockUseSWR.mockReturnValue({
        data: { role: 'USER', isEmailVerified: true },
        error: null,
        isLoading: false,
        mutate: jest.fn(),
      });

      render(<UserStatusCard />);

      const applyButton = screen.getByText(/apply for expert status/i);
      fireEvent.click(applyButton);

      await waitFor(() => {
        expect(screen.getByTestId('expert-form')).toBeInTheDocument();
      });
    });

    it('closes expert application form when cancel is clicked', async () => {
      mockUseSWR.mockReturnValue({
        data: { role: 'USER', isEmailVerified: true },
        error: null,
        isLoading: false,
        mutate: jest.fn(),
      });

      render(<UserStatusCard />);

      // Open form
      const applyButton = screen.getByText(/apply for expert status/i);
      fireEvent.click(applyButton);

      await waitFor(() => {
        expect(screen.getByTestId('expert-form')).toBeInTheDocument();
      });

      // Close form
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByTestId('expert-form')).not.toBeInTheDocument();
      });
    });
  });

  describe('Email Verification', () => {
    const mockFetch = jest.fn();

    beforeEach(() => {
      global.fetch = mockFetch;
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('sends verification email when verify button is clicked', async () => {
      mockUseSWR.mockReturnValue({
        data: { role: 'USER', isEmailVerified: false },
        error: null,
        isLoading: false,
        mutate: jest.fn(),
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Verification email sent' }),
      });

      render(<UserStatusCard />);

      const verifyButton = screen.getByText(/verify email/i);
      fireEvent.click(verifyButton);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/auth/send-verification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
      });
    });

    it('shows success message after sending verification email', async () => {
      mockUseSWR.mockReturnValue({
        data: { role: 'USER', isEmailVerified: false },
        error: null,
        isLoading: false,
        mutate: jest.fn(),
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Verification email sent' }),
      });

      render(<UserStatusCard />);

      const verifyButton = screen.getByText(/verify email/i);
      fireEvent.click(verifyButton);

      await waitFor(() => {
        expect(screen.getByText(/verification email sent/i)).toBeInTheDocument();
      });
    });

    it('handles verification email error', async () => {
      mockUseSWR.mockReturnValue({
        data: { role: 'USER', isEmailVerified: false },
        error: null,
        isLoading: false,
        mutate: jest.fn(),
      });

      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      render(<UserStatusCard />);

      const verifyButton = screen.getByText(/verify email/i);
      fireEvent.click(verifyButton);

      await waitFor(() => {
        expect(screen.getByText(/failed to send verification email/i)).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('shows loading state', () => {
      mockUseSWR.mockReturnValue({
        data: undefined,
        error: null,
        isLoading: true,
        mutate: jest.fn(),
      });

      render(<UserStatusCard />);

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('shows error state', () => {
      mockUseSWR.mockReturnValue({
        data: undefined,
        error: new Error('Failed to fetch'),
        isLoading: false,
        mutate: jest.fn(),
      });

      render(<UserStatusCard />);

      expect(screen.getByText(/error loading user status/i)).toBeInTheDocument();
    });
  });

  describe('No Session', () => {
    it('does not render when user is not logged in', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: jest.fn(),
      });

      const { container } = render(<UserStatusCard />);

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Accessibility', () => {
    it('has proper button roles and labels', () => {
      mockUseSWR.mockReturnValue({
        data: { role: 'USER', isEmailVerified: false },
        error: null,
        isLoading: false,
        mutate: jest.fn(),
      });

      render(<UserStatusCard />);

      expect(screen.getByRole('button', { name: /verify email/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /apply for expert status/i })).toBeInTheDocument();
    });

    it('has proper status indicators with text and icons', () => {
      mockUseSWR.mockReturnValue({
        data: { role: 'USER', isEmailVerified: true },
        error: null,
        isLoading: false,
        mutate: jest.fn(),
      });

      render(<UserStatusCard />);

      expect(screen.getByText('✅')).toBeInTheDocument();
      expect(screen.getByText(/email verified/i)).toBeInTheDocument();
    });
  });
});
