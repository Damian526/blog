import useSWR from 'swr';
import { api } from '@/server/api';
import { useMutation } from './useMutation';
import type { 
  Comment,
  CreateComment,
  UpdateComment 
} from '@/server/api/types';

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

  const createComment = useMutation(
    (commentData: { content: string; parentId?: number }) =>
      api.comments.create({ ...commentData, postId: postId! }),
    {
      revalidate: () => mutate(),
    }
  );

  const updateComment = useMutation(
    ({ id, content }: { id: number; content: string }) =>
      api.comments.update(id, { content }),
    {
      revalidate: () => mutate(),
    }
  );

  const deleteComment = useMutation(
    (id: number) => api.comments.delete(id),
    {
      revalidate: () => mutate(),
    }
  );

  return {
    comments: data || [],
    error,
    isLoading,
    createComment: createComment.mutate,
    isCreating: createComment.isLoading,
    updateComment: updateComment.mutate,
    isUpdating: updateComment.isLoading,
    deleteComment: deleteComment.mutate,
    isDeleting: deleteComment.isLoading,
    refetch: mutate,
  };
}
