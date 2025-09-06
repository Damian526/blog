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
  return function MockExpertApplicationForm({ onSuccess }: any) {
    return (
      <div data-testid="expert-form">
        <button onClick={() => onSuccess()}>Submit Application</button>
        <button onClick={() => onSuccess()}>Cancel</button>
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

  describe('User Status Display', () => {
    it('displays pending approval status for unverified user', () => {
      mockUseSWR.mockReturnValue({
        data: { 
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          verified: false,
          isExpert: false,
          role: 'USER',
          createdAt: '2024-01-01T00:00:00Z'
        },
        error: null,
        isLoading: false,
        mutate: jest.fn(),
      });

      render(<UserStatusCard />);

      expect(screen.getByText('Account Status')).toBeInTheDocument();
      expect(screen.getByText('⏳ Pending Approval')).toBeInTheDocument();
      expect(screen.getByText(/pending approval.*cannot participate yet/i)).toBeInTheDocument();
    });

    it('displays community member status for verified user', () => {
      mockUseSWR.mockReturnValue({
        data: { 
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          verified: true,
          isExpert: false,
          role: 'USER',
          createdAt: '2024-01-01T00:00:00Z'
        },
        error: null,
        isLoading: false,
        mutate: jest.fn(),
      });

      render(<UserStatusCard />);

      expect(screen.getByText('✅ Community Member')).toBeInTheDocument();
      expect(screen.getByText(/participate in discussions/i)).toBeInTheDocument();
    });

    it('displays verified expert status for expert user', () => {
      mockUseSWR.mockReturnValue({
        data: { 
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          verified: true,
          isExpert: true,
          role: 'EXPERT',
          createdAt: '2024-01-01T00:00:00Z'
        },
        error: null,
        isLoading: false,
        mutate: jest.fn(),
      });

      render(<UserStatusCard />);

      expect(screen.getByText('⭐ Verified Expert')).toBeInTheDocument();
      expect(screen.getByText(/write articles and participate/i)).toBeInTheDocument();
    });

    it('displays admin privileges for admin user', () => {
      mockUseSWR.mockReturnValue({
        data: { 
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          verified: true,
          isExpert: true,
          role: 'ADMIN',
          createdAt: '2024-01-01T00:00:00Z'
        },
        error: null,
        isLoading: false,
        mutate: jest.fn(),
      });

      render(<UserStatusCard />);

      expect(screen.getByText(/administrator privileges/i)).toBeInTheDocument();
    });
  });

  describe('Expert Application', () => {
    it('shows apply for expert button for verified community members', () => {
      mockUseSWR.mockReturnValue({
        data: { 
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          verified: true,
          isExpert: false,
          role: 'USER',
          createdAt: '2024-01-01T00:00:00Z'
        },
        error: null,
        isLoading: false,
        mutate: jest.fn(),
      });

      render(<UserStatusCard />);

      expect(screen.getByText(/apply to become a verified expert/i)).toBeInTheDocument();
      expect(screen.getByText('Apply to Become an Expert')).toBeInTheDocument();
    });

    it('does not show apply button for unverified users', () => {
      mockUseSWR.mockReturnValue({
        data: { 
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          verified: false,
          isExpert: false,
          role: 'USER',
          createdAt: '2024-01-01T00:00:00Z'
        },
        error: null,
        isLoading: false,
        mutate: jest.fn(),
      });

      render(<UserStatusCard />);

      expect(screen.queryByText('Apply to Become an Expert')).not.toBeInTheDocument();
    });

    it('does not show apply button for experts or admins', () => {
      mockUseSWR.mockReturnValue({
        data: { 
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          verified: true,
          isExpert: true,
          role: 'EXPERT',
          createdAt: '2024-01-01T00:00:00Z'
        },
        error: null,
        isLoading: false,
        mutate: jest.fn(),
      });

      render(<UserStatusCard />);

      expect(screen.queryByText('Apply to Become an Expert')).not.toBeInTheDocument();
    });

    it('opens expert application form when apply button is clicked', async () => {
      mockUseSWR.mockReturnValue({
        data: { 
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          verified: true,
          isExpert: false,
          role: 'USER',
          createdAt: '2024-01-01T00:00:00Z'
        },
        error: null,
        isLoading: false,
        mutate: jest.fn(),
      });

      render(<UserStatusCard />);

      const applyButton = screen.getByText('Apply to Become an Expert');
      fireEvent.click(applyButton);

      await waitFor(() => {
        expect(screen.getByTestId('expert-form')).toBeInTheDocument();
      });
    });

    it('shows application status when user has applied', () => {
      mockUseSWR.mockReturnValue({
        data: { 
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          verified: false,
          isExpert: false,
          verificationReason: 'I am a software engineer',
          role: 'USER',
          createdAt: '2024-01-01T00:00:00Z'
        },
        error: null,
        isLoading: false,
        mutate: jest.fn(),
      });

      render(<UserStatusCard />);

      expect(screen.getByText('Expert Application Status:')).toBeInTheDocument();
      expect(screen.getByText('Your application is under review.')).toBeInTheDocument();
    });
  });

  describe('Loading and Error States', () => {
    it('shows loading state', () => {
      mockUseSWR.mockReturnValue({
        data: undefined,
        error: null,
        isLoading: true,
        mutate: jest.fn(),
      });

      render(<UserStatusCard />);

      expect(screen.getByText(/loading your status/i)).toBeInTheDocument();
    });

    it('shows error state', () => {
      mockUseSWR.mockReturnValue({
        data: undefined,
        error: new Error('Failed to fetch'),
        isLoading: false,
        mutate: jest.fn(),
      });

      render(<UserStatusCard />);

      expect(screen.getByText(/unable to load status information/i)).toBeInTheDocument();
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
    it('has proper account status display', () => {
      mockUseSWR.mockReturnValue({
        data: { 
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          verified: true,
          isExpert: false,
          role: 'USER',
          createdAt: '2024-01-01T00:00:00Z'
        },
        error: null,
        isLoading: false,
        mutate: jest.fn(),
      });

      render(<UserStatusCard />);

      expect(screen.getByText('Account Status')).toBeInTheDocument();
      expect(screen.getByText('✅ Community Member')).toBeInTheDocument();
    });

    it('has proper apply button when applicable', () => {
      mockUseSWR.mockReturnValue({
        data: { 
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          verified: true,
          isExpert: false,
          role: 'USER',
          createdAt: '2024-01-01T00:00:00Z'
        },
        error: null,
        isLoading: false,
        mutate: jest.fn(),
      });

      render(<UserStatusCard />);

      expect(screen.getByRole('button', { name: /apply to become an expert/i })).toBeInTheDocument();
    });
  });
});
