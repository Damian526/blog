import useSWR from 'swr';
import { api } from '@/server/api';
import { useMutation } from './useMutation';
import { mutate as globalMutate } from 'swr';
import type {
  Post,
  PostSummary,
  PostFilters,
  CreatePost,
  UpdatePost,
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

  const createPost = useMutation(
    (postData: CreatePost) => api.posts.create(postData),
    {
      revalidate: () => {
        // Simple revalidation without global cache clearing
        mutate();
      },
    },
  );

  const updatePost = useMutation(
    ({ id, data: updateData }: { id: number; data: UpdatePost }) =>
      api.posts.update(id, updateData),
    {
      revalidate: () => {
        mutate();
      },
    },
  );

  const deletePost = useMutation((id: number) => api.posts.delete(id), {
    revalidate: () => {
      mutate();
    },
  });

  return {
    posts: data || [],
    error,
    isLoading,
    refetch: mutate,
    createPost: createPost.mutate,
    updatePost: updatePost.mutate,
    deletePost: deletePost.mutate,
    isCreating: createPost.isLoading,
    isUpdating: updatePost.isLoading,
    isDeleting: deletePost.isLoading,
  };
}

// Specific hooks
export const usePostsByAuthor = (
  authorId: number,
  initialData?: PostSummary[],
) => useDashboardPosts({ authorId }, initialData);
