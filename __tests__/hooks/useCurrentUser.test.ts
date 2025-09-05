import { renderHook, waitFor } from '@testing-library/react';
import useSWR from 'swr';
import '@testing-library/jest-dom';
import { useCurrentUser } from '@/hooks/useCurrentUser';

// Mock the API
jest.mock('@/server/api', () => ({
  api: {
    users: {
      getCurrentUser: jest.fn(),
    },
  },
}));

// Mock SWR
jest.mock('swr');

const mockUseSWR = useSWR as jest.MockedFunction<typeof useSWR>;

describe('useCurrentUser Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns user data when authenticated', async () => {
    const mockUserData = {
      user: {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'USER' as const,
      },
    };

    mockUseSWR.mockReturnValue({
      data: mockUserData,
      error: null,
      isLoading: false,
      mutate: jest.fn(),
    });

    const { result } = renderHook(() => useCurrentUser());

    expect(result.current.user).toEqual(mockUserData.user);
    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('returns null user when not authenticated', () => {
    mockUseSWR.mockReturnValue({
      data: null,
      error: null,
      isLoading: false,
      mutate: jest.fn(),
    });

    const { result } = renderHook(() => useCurrentUser());

    expect(result.current.user).toBeNull();
    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('returns loading state correctly', () => {
    mockUseSWR.mockReturnValue({
      data: undefined,
      error: null,
      isLoading: true,
      mutate: jest.fn(),
    });

    const { result } = renderHook(() => useCurrentUser());

    expect(result.current.user).toBeNull();
    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.isLoading).toBe(true);
  });

  it('returns error state correctly', () => {
    const mockError = new Error('Session fetch failed');
    
    mockUseSWR.mockReturnValue({
      data: undefined,
      error: mockError,
      isLoading: false,
      mutate: jest.fn(),
    });

    const { result } = renderHook(() => useCurrentUser());

    expect(result.current.user).toBeNull();
    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.error).toBe(mockError);
    expect(result.current.isLoading).toBe(false);
  });

  it('provides refetch functionality', () => {
    const mockMutate = jest.fn();
    
    mockUseSWR.mockReturnValue({
      data: null,
      error: null,
      isLoading: false,
      mutate: mockMutate,
    });

    const { result } = renderHook(() => useCurrentUser());

    result.current.refetch();

    expect(mockMutate).toHaveBeenCalledTimes(1);
  });

  it('calls SWR with correct configuration', () => {
    mockUseSWR.mockReturnValue({
      data: null,
      error: null,
      isLoading: false,
      mutate: jest.fn(),
    });

    renderHook(() => useCurrentUser());

    expect(mockUseSWR).toHaveBeenCalledWith('/api/auth/session', {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      shouldRetryOnError: false,
      dedupingInterval: 30000,
    });
  });

  it('handles admin user correctly', () => {
    const mockAdminData = {
      user: {
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'ADMIN' as const,
      },
    };

    mockUseSWR.mockReturnValue({
      data: mockAdminData,
      error: null,
      isLoading: false,
      mutate: jest.fn(),
    });

    const { result } = renderHook(() => useCurrentUser());

    expect(result.current.user).toEqual(mockAdminData.user);
    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.user?.role).toBe('ADMIN');
  });

  it('handles user without name correctly', () => {
    const mockUserData = {
      user: {
        email: 'user@example.com',
        role: 'USER' as const,
      },
    };

    mockUseSWR.mockReturnValue({
      data: mockUserData,
      error: null,
      isLoading: false,
      mutate: jest.fn(),
    });

    const { result } = renderHook(() => useCurrentUser());

    expect(result.current.user).toEqual(mockUserData.user);
    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.user?.name).toBeUndefined();
  });

  it('handles empty session data correctly', () => {
    mockUseSWR.mockReturnValue({
      data: {},
      error: null,
      isLoading: false,
      mutate: jest.fn(),
    });

    const { result } = renderHook(() => useCurrentUser());

    expect(result.current.user).toBeNull();
    expect(result.current.isLoggedIn).toBe(false);
  });
});
