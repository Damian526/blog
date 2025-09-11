import useSWR from 'swr';
import { api } from '@/server/api';
import type { Comment } from '@/server/api/types';

export function useComments(postId: number | null, includeReplies = true) {
  const { data, error, isLoading, mutate } = useSWR(
    postId ? ['comments', postId, includeReplies] : null,
    () => api.comments.getByPost(postId!, includeReplies),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // 1 minute
    }
  );

  const createComment = async (commentData: { content: string; parentId?: number }) => {
    if (!postId) throw new Error('Post ID is required');
    
    try {
      const newComment = await api.comments.create({ ...commentData, postId });
      mutate(); // Refresh the comments
      return { success: true, data: newComment };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create comment'
      };
    }
  };

  const updateComment = async ({ id, content }: { id: number; content: string }) => {
    try {
      const updatedComment = await api.comments.update(id, { content });
      mutate(); // Refresh the comments
      return { success: true, data: updatedComment };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update comment'
      };
    }
  };

  const deleteComment = async (id: number) => {
    try {
      const result = await api.comments.delete(id);
      mutate(); // Refresh the comments
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete comment'
      };
    }
  };

  return {
    comments: data || [],
    error,
    isLoading,
    createComment,
    updateComment,
    deleteComment,
    refetch: mutate,
  };
}
