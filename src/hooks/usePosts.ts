import useSWR from 'swr';
import { Post, PostFilters, api } from '@/server/api';


interface UsePostsOptions {
  filters?: Partial<PostFilters>;
  enabled?: boolean;
  refreshInterval?: number;
}

export function usePosts(options: UsePostsOptions = {}) {
  const { filters = {}, enabled = true, refreshInterval } = options;

  // Create a stable cache key
  const cacheKey = enabled 
    ? ['posts', JSON.stringify(filters)]
    : null;

  const {
    data: posts,
    error,
    isLoading,
    mutate,
  } = useSWR<Post[]>(
    cacheKey,
    () => api.posts.getAll(filters),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      shouldRetryOnError: false,
      dedupingInterval: 300000, // 5 minutes
      refreshInterval,
    }
  );

  const createPost = async (postData: Parameters<typeof api.posts.create>[0]) => {
    // Optimistic update
    if (posts) {
      const tempPost = {
        ...postData,
        id: Date.now(), // Temporary ID
        createdAt: new Date(),
        updatedAt: new Date(),
        authorId: 0, // Will be set by server
        author: { id: 0, name: '', email: '', image: null },
        _count: { comments: 0 },
      } as Post;
      
      mutate([tempPost, ...posts], false);
    }

    try {
      const newPost = await api.posts.create(postData);
      mutate(); // Revalidate to get fresh data
      return newPost;
    } catch (error) {
      mutate(); // Revert on error
      throw error;
    }
  };

  const refetch = () => mutate();

  return {
    posts: posts || [],
    error,
    isLoading,
    mutate,
    createPost,
    refetch,
  };
}

// ============================================
// PUBLISHED POSTS HOOK
// ============================================

export function usePublishedPosts(options: Omit<UsePostsOptions, 'filters'> & { filters?: Omit<Partial<PostFilters>, 'published'> } = {}) {
  return usePosts({
    ...options,
    filters: {
      ...options.filters,
      published: true,
    },
  });
}


export function usePostsByAuthor(authorId: number, options: Omit<UsePostsOptions, 'filters'> & { filters?: Omit<Partial<PostFilters>, 'authorId'> } = {}) {
  return usePosts({
    ...options,
    filters: {
      ...options.filters,
      authorId,
    },
  });
}

// ============================================
// POSTS SEARCH HOOK
// ============================================

export function usePostsSearch(query: string, options: Omit<UsePostsOptions, 'filters'> & { filters?: Omit<Partial<PostFilters>, 'search'> } = {}) {
  return usePosts({
    ...options,
    enabled: query.length > 2, // Only search if query is meaningful
    filters: {
      ...options.filters,
      search: query,
    },
  });
}
