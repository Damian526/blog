import useSWR from 'swr';
import { Comment, CreateComment, UpdateComment } from '@/server/api';

// ============================================
// MAIN COMMENTS HOOK FOR POST COMMENTS
// ============================================

export function useComments(postId: number | null, includeReplies: boolean = true) {
  const {
    data: comments,
    error,
    isLoading,
    mutate,
  } = useSWR<Comment[]>(
    postId ? ['comments', postId, includeReplies] : null,
    async () => {
      if (!postId) return [];
      const { api } = await import('@/server/api');
      return api.comments.getByPost(postId, includeReplies);
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      shouldRetryOnError: false,
      dedupingInterval: 60000, // 1 minute for comments
    }
  );

  const createComment = async (commentData: Omit<CreateComment, 'postId'>) => {
    if (!postId) throw new Error('Post ID is required');

    const fullCommentData: CreateComment = {
      ...commentData,
      postId,
    };

    // Optimistic update
    if (comments) {
      const tempComment: Comment = {
        ...fullCommentData,
        id: Date.now(), // Temporary ID
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 0, // Will be set by server
        author: { 
          id: 0, 
          name: 'You', 
          email: '', 
          image: null, 
          createdAt: new Date(), 
          updatedAt: new Date() 
        },
        replies: [],
        _count: { replies: 0 },
      };

      mutate([...comments, tempComment], false);
    }

    try {
      const { api } = await import('@/server/api');
      const newComment = await api.comments.create(fullCommentData);
      mutate(); // Revalidate to get fresh data
      return newComment;
    } catch (error) {
      mutate(); // Revert on error
      throw error;
    }
  };

  const updateComment = async (commentId: number, updateData: UpdateComment) => {
    if (!comments) return;

    // Find the comment to update
    const originalComments = [...comments];
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, ...updateData, updatedAt: new Date() };
      }
      // Handle nested replies
      if (comment.replies?.length) {
        return {
          ...comment,
          replies: comment.replies.map(reply =>
            reply.id === commentId 
              ? { ...reply, ...updateData, updatedAt: new Date() }
              : reply
          ),
        };
      }
      return comment;
    });

    // Optimistic update
    mutate(updatedComments, false);

    try {
      const { api } = await import('@/server/api');
      const updatedComment = await api.comments.update(commentId, updateData);
      mutate(); // Revalidate to get fresh data
      return updatedComment;
    } catch (error) {
      mutate(originalComments, false); // Revert on error
      throw error;
    }
  };

  const deleteComment = async (commentId: number) => {
    if (!comments) return;

    // Store original state
    const originalComments = [...comments];
    
    // Optimistic update - remove the comment
    const updatedComments = comments.filter(comment => comment.id !== commentId)
      .map(comment => ({
        ...comment,
        replies: comment.replies?.filter(reply => reply.id !== commentId) || [],
      }));

    mutate(updatedComments, false);

    try {
      const { api } = await import('@/server/api');
      await api.comments.delete(commentId);
      mutate(); // Revalidate to get fresh data
    } catch (error) {
      mutate(originalComments, false); // Revert on error
      throw error;
    }
  };

  const replyToComment = async (parentId: number, content: string) => {
    return createComment({ content, parentId });
  };

  const refetch = () => mutate();

  return {
    comments: comments || [],
    error,
    isLoading,
    mutate,
    createComment,
    updateComment,
    deleteComment,
    replyToComment,
    refetch,
  };
}

// ============================================
// SIMPLE SINGLE COMMENT HOOK (IF NEEDED)
// ============================================

export function useComment(commentId: number | null) {
  const {
    data: comment,
    error,
    isLoading,
    mutate,
  } = useSWR<Comment>(
    commentId ? ['comment', commentId] : null,
    async () => {
      if (!commentId) return null;
      const { api } = await import('@/server/api');
      return api.comments.getById(commentId);
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      shouldRetryOnError: false,
      dedupingInterval: 60000,
    }
  );

  return {
    comment: comment || null,
    error,
    isLoading,
    mutate,
    refetch: () => mutate(),
  };
}

// ============================================
// USER COMMENTS - SIMPLE DIRECT FETCH FUNCTION
// ============================================

// Instead of a hook, just export a function to fetch user comments when needed
export async function fetchUserComments(userId: number, page: number = 1, limit: number = 10) {
  const { api } = await import('@/server/api');
  return api.comments.getByUser(userId, page, limit);
}

// If you really need a hook for user comments, use this simple version:
export function useUserComments(userId: number | null, page: number = 1, limit: number = 10) {
  const {
    data: comments,
    error,
    isLoading,
    mutate,
  } = useSWR<Comment[]>(
    userId ? ['user-comments', userId, page, limit] : null,
    async () => {
      if (!userId) return [];
      return fetchUserComments(userId, page, limit);
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      shouldRetryOnError: false,
      dedupingInterval: 120000, // 2 minutes
    }
  );

  return {
    comments: comments || [],
    error,
    isLoading,
    mutate,
    refetch: () => mutate(),
  };
}
