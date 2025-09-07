// ============================================
// POSTS HOOKS
// ============================================

import useSWR from 'swr';
import { api } from '@/server/api';
import { useMutation } from './useMutation';
import type { 
  Post, 
  PostFilters,
  CreatePost,
  UpdatePost 
} from '@/server/api/types';

export function usePosts(filters: Partial<PostFilters> = {}) {
  const { data, error, isLoading, mutate } = useSWR(
    ['posts', JSON.stringify(filters)],
    () => api.posts.getAll(filters),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 300000, // 5 minutes
    }
  );

  const createPost = useMutation(
    (postData: CreatePost) => api.posts.create(postData),
    {
      revalidate: () => mutate(),
    }
  );

  return {
    posts: data || [],
    error,
    isLoading,
    refetch: mutate,
    createPost: createPost.mutate,
    isCreating: createPost.isLoading,
  };
}

// Specialized post hooks
export const usePublishedPosts = () => usePosts({ published: true });
export const usePostsByAuthor = (authorId: number) => usePosts({ authorId });