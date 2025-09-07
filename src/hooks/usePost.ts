// ============================================
// SINGLE POST HOOKS
// ============================================

import useSWR from 'swr';
import { api } from '@/server/api';
import { useMutation } from './useMutation';
import { useComments } from './useComments';
import type { 
  Post, 
  UpdatePost 
} from '@/server/api/types';

export function usePost(postId: number | null) {
  const { data, error, isLoading, mutate } = useSWR(
    postId ? ['post', postId] : null,
    () => api.posts.getById(postId!),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  const updatePost = useMutation(
    (updateData: UpdatePost) => api.posts.update(postId!, updateData),
    {
      revalidate: () => mutate(),
    }
  );

  const deletePost = useMutation(
    () => api.posts.delete(postId!),
    {
      onSuccess: () => mutate(undefined, false),
    }
  );

  return {
    post: data || null,
    error,
    isLoading,
    updatePost: updatePost.mutate,
    isUpdating: updatePost.isLoading,
    deletePost: deletePost.mutate,
    isDeleting: deletePost.isLoading,
    refetch: mutate,
    togglePublished: () => updatePost.mutate({ published: !data?.published }),
  };
}

// ============================================
// COMPOUND HOOKS FOR COMPLEX SCENARIOS
// ============================================

export function usePostWithComments(postId: number | null) {
  const postData = usePost(postId);
  const commentsData = useComments(postId);

  return {
    post: postData.post,
    comments: commentsData.comments,
    isLoading: postData.isLoading || commentsData.isLoading,
    error: postData.error || commentsData.error,
    updatePost: postData.updatePost,
    createComment: commentsData.createComment,
    refetch: () => {
      postData.refetch();
      commentsData.refetch();
    },
  };
}
