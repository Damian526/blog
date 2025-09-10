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
  // Force unique key every time to bypass SWR cache completely
  const cacheKey = [`dashboard-posts-no-cache`, JSON.stringify(filters), Date.now()];
  
  const { data, error, isLoading, mutate } = useSWR(
    cacheKey,
    () => api.posts.getAll(filters),
    {
      fallbackData: initialData,
      // DISABLE ALL SWR CACHING
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      dedupingInterval: 0,
      refreshInterval: 0,
      errorRetryCount: 0,
      shouldRetryOnError: false,
      revalidateOnMount: true,
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
