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

// Dashboard posts hook (CSR with aggressive revalidation)
export function useDashboardPosts(
  filters: Partial<PostFilters> = {},
  initialData?: PostSummary[],
) {
  const { data, error, isLoading, mutate } = useSWR(
    ['dashboard-posts', JSON.stringify(filters)],
    () => api.posts.getAll(filters),
    {
      fallbackData: initialData,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 0, // No deduping for user-specific data
      refreshInterval: 30000, // 30 seconds auto refresh
      errorRetryCount: 3,
      errorRetryInterval: 1000,
    },
  );

  const createPost = useMutation(
    (postData: CreatePost) => api.posts.create(postData),
    {
      revalidate: () => {
        // Invalidate all dashboard posts cache
        mutate();
        globalMutate(
          (key) => Array.isArray(key) && key[0] === 'dashboard-posts',
        );
      },
    },
  );

  const updatePost = useMutation(
    ({ id, data: updateData }: { id: number; data: UpdatePost }) =>
      api.posts.update(id, updateData),
    {
      revalidate: () => {
        mutate();
        globalMutate(
          (key) => Array.isArray(key) && key[0] === 'dashboard-posts',
        );
      },
    },
  );

  const deletePost = useMutation((id: number) => api.posts.delete(id), {
    revalidate: () => {
      mutate();
      globalMutate((key) => Array.isArray(key) && key[0] === 'dashboard-posts');
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
