import { renderHook, waitFor } from '@testing-library/react';
import useSWR from 'swr';
import '@testing-library/jest-dom';
import { useCurrentUser } from '@/hooks/useCurrentUser';

// Mock the API
jest.mock('@/server/api', () => ({
  api: {
    users: {
      getCurrent: jest.fn(),
      update: jest.fn(),
    },
  },
}));

// Mock SWR
jest.mock('swr');

const mockUseSWR = useSWR as jest.MockedFunction<typeof useSWR>;

// Helper function to create complete SWR mock
const createSWRMock = (data: any, error: any = null, isLoading: boolean = false) => ({
  data,
  error,
  isLoading,
  isValidating: false,
  mutate: jest.fn(),
});

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

    mockUseSWR.mockReturnValue(createSWRMock(mockUserData));

    const { result } = renderHook(() => useCurrentUser());

    expect(result.current.user).toEqual(mockUserData.user);
    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('returns null user when not authenticated', () => {
    mockUseSWR.mockReturnValue(createSWRMock(null));

    const { result } = renderHook(() => useCurrentUser());

    expect(result.current.user).toBeNull();
    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('returns loading state correctly', () => {
    mockUseSWR.mockReturnValue(createSWRMock(undefined, null, true));

    const { result } = renderHook(() => useCurrentUser());

    expect(result.current.user).toBeNull();
    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.isLoading).toBe(true);
  });

  it('returns error state correctly', () => {
    const mockError = new Error('Session fetch failed');
    
    mockUseSWR.mockReturnValue(createSWRMock(undefined, mockError));

    const { result } = renderHook(() => useCurrentUser());

    expect(result.current.user).toBeNull();
    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.error).toBe(mockError);
    expect(result.current.isLoading).toBe(false);
  });

  it('provides mutate functionality', () => {
    const mockMutate = jest.fn();
    const mockData = createSWRMock(null);
    mockData.mutate = mockMutate;
    
    mockUseSWR.mockReturnValue(mockData);

    const { result } = renderHook(() => useCurrentUser());

    result.current.mutate();

    expect(mockMutate).toHaveBeenCalledTimes(1);
  });

  it('calls SWR with correct configuration', () => {
    mockUseSWR.mockReturnValue(createSWRMock(null));

    renderHook(() => useCurrentUser());

    expect(mockUseSWR).toHaveBeenCalledWith('current-user', expect.any(Function), {
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

    mockUseSWR.mockReturnValue(createSWRMock(mockAdminData));

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

    mockUseSWR.mockReturnValue(createSWRMock(mockUserData));

    const { result } = renderHook(() => useCurrentUser());

    expect(result.current.user).toEqual(mockUserData.user);
    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.user?.name).toBeUndefined();
  });

  it('handles empty session data correctly', () => {
    mockUseSWR.mockReturnValue(createSWRMock({}));

    const { result } = renderHook(() => useCurrentUser());

    expect(result.current.user).toBeNull();
    expect(result.current.isLoggedIn).toBe(false);
  });
});
