import useSWR from 'swr';

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  author: {
    name: string | null;
    email: string;
  };
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
  });

  return {
    post: post || null,
    error,
    isLoading,
    mutate,
  };
}
