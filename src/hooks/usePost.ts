import useSWR from 'swr';

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  published: boolean; 
  coverImageUrl?: string; 
  author: {
    id: number; 
    name: string | null;
    email: string;
    image?: string; 
  };
  subcategories?: {
    id: number;
    name: string;
    category: {
      id: number;
      name: string;
    };
  }[];
  _count: {
    comments: number;
  };
}

export function usePost(postId: number | null) {
  const {
    data: post,
    error,
    isLoading,
    mutate,
  } = useSWR<Post>(postId ? `/api/posts/${postId}` : null, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    shouldRetryOnError: false,
    // Cache posts for 5 minutes
    dedupingInterval: 300000,
  });

  const updatePost = async (updatedData: Partial<Post>) => {
    if (!post) return;

    // Optimistic update
    mutate({ ...post, ...updatedData }, false);

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error('Update failed');
      mutate();
    } catch (error) {
      mutate();
      throw error;
    }
  };

  const togglePublished = () => {
    if (!post) return;
    return updatePost({ published: !post.published });
  };

  return {
    post: post || null,
    error,
    isLoading,
    mutate,
    updatePost, 
    togglePublished, 
    isPublished: post?.published || false, 
  };
}
