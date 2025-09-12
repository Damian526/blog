import useSWR from 'swr';
import { api } from '@/server/api';
import type { AdminUser, AdminStats, AdminPostsResponse } from '@/server/api/types';

export function useAdminUsers(filter: 'all' | 'pending' | 'verification-requests' = 'all') {
  const { data, error, isLoading, mutate } = useSWR<AdminUser[]>(
    ['admin/users', filter],
    () => api.get(`/api/admin/users?filter=${filter}`) as Promise<AdminUser[]>,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 30000, // 30 seconds
    }
  );

  return {
    users: data || [],
    error,
    isLoading,
    refetch: mutate,
  };
}

export function useAdminPosts(filter: 'all' | 'pending' | 'published' | 'rejected' = 'all', page: number = 1, limit: number = 10) {
  const { data, error, isLoading, mutate } = useSWR<AdminPostsResponse>(
    ['admin/posts', filter, page, limit],
    () => api.get(`/api/admin/posts?filter=${filter}&page=${page}&limit=${limit}`) as Promise<AdminPostsResponse>,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 30000, // 30 seconds
    }
  );

  return {
    posts: data?.posts || [],
    pagination: data?.pagination,
    error,
    isLoading,
    refetch: mutate,
  };
}

export function useAdminStats() {
  const { data, error, isLoading, mutate } = useSWR<AdminStats>(
    'admin/stats',
    () => api.get('/api/admin/stats') as Promise<AdminStats>,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // 1 minute
    }
  );

  return {
    stats: data,
    error,
    isLoading,
    refetch: mutate,
  };
}
