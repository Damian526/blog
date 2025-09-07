// ============================================
// USER HOOKS
// ============================================

import useSWR from 'swr';
import { api } from '@/server/api';
import { useMutation } from './useMutation';
import type { User } from '@/server/api/types';

export function useCurrentUser() {
  const { data, error, isLoading, mutate } = useSWR(
    'current-user',
    () => api.users.getCurrent(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      shouldRetryOnError: false,
      dedupingInterval: 30000,
    }
  );

  const updateProfile = useMutation(
    (profileData: { name?: string; email?: string; profilePicture?: string }) =>
      api.users.updateCurrentProfile(profileData),
    {
      revalidate: () => mutate(),
    }
  );

  return {
    user: data?.user || null,
    error,
    isLoading,
    updateProfile: updateProfile.mutate,
    isUpdating: updateProfile.isLoading,
    refetch: mutate,
    isAuthenticated: !!data?.user,
  };
}

export function useUser(userId: number | null) {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? ['user', userId] : null,
    () => api.users.getById(userId!),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    user: data || null,
    error,
    isLoading,
    refetch: mutate,
  };
}

// Legacy alias for backward compatibility
export { useCurrentUser as useAuth };
