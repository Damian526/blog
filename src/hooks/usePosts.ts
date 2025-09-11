import useSWR from 'swr';
import { api } from '@/server/api';
import { mutate as globalMutate } from 'swr';
import type {
  Post,
  PostSummary,
  PostFilters,
} from '@/server/api/types';

// Dashboard posts hook (NO CACHING - for testing)
export function useDashboardPosts(
  filters: Partial<PostFilters> = {},
  initialData?: PostSummary[],
) {


  const cacheKey = ['dashboard-posts-v3', JSON.stringify(filters)];

  const { data, error, isLoading, mutate } = useSWR(
    cacheKey,
    () => api.posts.getAll(filters),
    {
      fallbackData: initialData,
      // Smart caching for dashboard
      revalidateOnFocus: true, // Refresh when user returns to tab
      revalidateOnReconnect: true, // Refresh when internet reconnects
      dedupingInterval: 30000, // 30 seconds - short cache for real-time feel
      refreshInterval: 0, // No auto refresh - manual only
      errorRetryCount: 2, // Retry on error but not too much
      errorRetryInterval: 1000,
      revalidateIfStale: true, // Always get fresh data if cache is stale
      // Keep cache fresh
      keepPreviousData: false, // Don't show old data while loading new
    },
  );

  // Note: createPost, updatePost, deletePost are now server actions
  // Import and use them directly from /lib/actions/posts.ts

  return {
    posts: data || [],
    error,
    isLoading,
    refetch: mutate,
  };
}

// Specific hooks
export const usePostsByAuthor = (
  authorId: number,
  initialData?: PostSummary[],
) => useDashboardPosts({ authorId }, initialData);
