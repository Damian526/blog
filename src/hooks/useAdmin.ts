// ============================================
// ADMIN HOOKS
// ============================================

import useSWR from 'swr';
import { api } from '@/server/api';
import { useMutation } from './useMutation';
import type { User } from '@/server/api/types';

export function useAdminUsers() {
  const { data, error, isLoading, mutate } = useSWR(
    'admin-users',
    () => api.admin.getUsers(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  const approveUser = useMutation(
    (userId: number) => api.admin.approveUser(userId),
    {
      revalidate: () => mutate(),
    }
  );

  const rejectUser = useMutation(
    ({ userId, reason }: { userId: number; reason: string }) =>
      api.admin.rejectUser(userId, reason),
    {
      revalidate: () => mutate(),
    }
  );

  const updateUserRole = useMutation(
    ({ userId, role }: { userId: number; role: 'ADMIN' | 'USER' }) =>
      api.admin.updateUserRole(userId, role),
    {
      revalidate: () => mutate(),
    }
  );

  return {
    users: data || [],
    error,
    isLoading,
    approveUser: approveUser.mutate,
    isApproving: approveUser.isLoading,
    rejectUser: rejectUser.mutate,
    isRejecting: rejectUser.isLoading,
    updateUserRole: updateUserRole.mutate,
    isUpdatingRole: updateUserRole.isLoading,
    refetch: mutate,
  };
}

export function useAdminStats() {
  const { data, error, isLoading, mutate } = useSWR(
    'admin-stats',
    () => api.admin.getStats(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 300000, // 5 minutes
    }
  );

  return {
    stats: data || null,
    error,
    isLoading,
    refetch: mutate,
  };
}
