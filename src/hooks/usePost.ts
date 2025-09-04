import useSWR from 'swr';
import { Post, api } from '@/server/api';

export function usePost(postId: number | null) {
  const {
    data: post,
    error,
    isLoading,
    mutate,
  } = useSWR<Post>(
    postId ? ['post', postId] : null,
    () => {
      if (!postId) return null;
      return api.posts.getById(postId);
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      shouldRetryOnError: false,
      // Cache posts for 5 minutes
      dedupingInterval: 300000,
    }
  );

  const updatePost = async (updatedData: Partial<Post>) => {
    if (!post || !postId) return;

    // ✅ Store original post before optimistic update
    const originalPost = { ...post };

    // Optimistic update
    mutate({ ...post, ...updatedData }, false);

    try {
      const updatedPost = await api.posts.update(postId, updatedData);
      
      // Update with the actual response from server
      mutate(updatedPost, false);
      return updatedPost;
    } catch (error) {
      // REVERT to original post on error
      mutate(originalPost, false);
      throw error;
    }
  };

  const togglePublished = async () => {
    if (!post) return;
    return updatePost({ published: !post.published });
  };

  const deletePost = async () => {
    if (!postId) return;
    
    try {
      await api.posts.delete(postId);
      mutate(undefined, false); // Clear the cache
    } catch (error) {
      throw error;
    }
  };

  return {
    post: post || null,
    error,
    isLoading,
    mutate,
    updatePost,
    togglePublished,
    deletePost,
    isPublished: post?.published || false,
  };
}
