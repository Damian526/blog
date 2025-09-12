import useSWR from 'swr';
import { api } from '@/server/api';
import { useComments } from './useComments';
import type { 
  Post, 
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

  // Note: updatePost, deletePost are now server actions
  // Import and use them directly from /lib/actions/posts.ts

  return {
    post: data || null,
    error,
    isLoading,
    refetch: mutate,
  };
}

export function usePostWithComments(postId: number | null) {
  const postData = usePost(postId);
  const commentsData = useComments(postId);

  return {
    post: postData.post,
    comments: commentsData.comments,
    isLoading: postData.isLoading || commentsData.isLoading,
    error: postData.error || commentsData.error,
    createComment: commentsData.createComment,
    refetch: () => {
      postData.refetch();
      commentsData.refetch();
    },
  };
}
