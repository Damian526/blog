import { apiClient, CACHE_TAGS, CACHE_TIMES } from './client';
import {
  Post,
  PostSchema,
  CreatePost,
  UpdatePost,
  PostFilters,
  PostFiltersSchema,
  CreatePostSchema,
  UpdatePostSchema,
} from './types';
import { z } from 'zod';

// ============================================
// POSTS API SERVICE
// ============================================

export class PostsApi {
  /**
   * Get all posts with optional filtering and pagination
   */
  static async getPosts(filters: Partial<PostFilters> = {}) {
    // Validate and sanitize filters
    const validatedFilters = PostFiltersSchema.parse(filters);
    
    const searchParams = new URLSearchParams();
    
    if (validatedFilters.published !== undefined) {
      searchParams.set('published', validatedFilters.published.toString());
    }
    if (validatedFilters.categoryIds?.length) {
      searchParams.set('categoryIds', validatedFilters.categoryIds.join(','));
    }
    if (validatedFilters.subcategoryIds?.length) {
      searchParams.set('subcategoryIds', validatedFilters.subcategoryIds.join(','));
    }
    if (validatedFilters.authorId) {
      searchParams.set('authorId', validatedFilters.authorId.toString());
    }
    if (validatedFilters.search) {
      searchParams.set('search', validatedFilters.search);
    }
    
    searchParams.set('page', validatedFilters.page.toString());
    searchParams.set('limit', validatedFilters.limit.toString());
    searchParams.set('sortBy', validatedFilters.sortBy);
    searchParams.set('sortOrder', validatedFilters.sortOrder);

    const endpoint = `/api/posts?${searchParams.toString()}`;
    
    return apiClient.get(
      endpoint,
      {
        tags: [CACHE_TAGS.POSTS],
        revalidate: CACHE_TIMES.MEDIUM,
      },
      z.array(PostSchema)
    );
  }

  /**
   * Get a single post by ID
   */
  static async getPost(id: number) {
    return apiClient.get(
      `/api/posts/${id}`,
      {
        tags: [CACHE_TAGS.POST(id), CACHE_TAGS.POSTS],
        revalidate: CACHE_TIMES.MEDIUM,
      },
      PostSchema
    );
  }

  /**
   * Get posts by author
   */
  static async getPostsByAuthor(authorId: number, filters: Partial<PostFilters> = {}) {
    return this.getPosts({
      ...filters,
      authorId,
    });
  }

  /**
   * Get published posts only
   */
  static async getPublishedPosts(filters: Partial<PostFilters> = {}) {
    return this.getPosts({
      ...filters,
      published: true,
    });
  }

  /**
   * Search posts
   */
  static async searchPosts(query: string, filters: Partial<PostFilters> = {}) {
    return this.getPosts({
      ...filters,
      search: query,
    });
  }

  /**
   * Create a new post
   */
  static async createPost(data: CreatePost) {
    const validatedData = CreatePostSchema.parse(data);
    
    return apiClient.post(
      '/api/posts',
      validatedData,
      {
        tags: [CACHE_TAGS.POSTS],
      },
      PostSchema
    );
  }

  /**
   * Update an existing post
   */
  static async updatePost(id: number, data: UpdatePost) {
    const validatedData = UpdatePostSchema.parse(data);
    
    return apiClient.patch(
      `/api/posts/${id}`,
      validatedData,
      {
        tags: [CACHE_TAGS.POST(id), CACHE_TAGS.POSTS],
      },
      PostSchema
    );
  }

  /**
   * Delete a post
   */
  static async deletePost(id: number) {
    return apiClient.delete(
      `/api/posts/${id}`,
      {
        tags: [CACHE_TAGS.POST(id), CACHE_TAGS.POSTS],
      }
    );
  }

  /**
   * Toggle post published status
   */
  static async togglePublished(id: number, published: boolean) {
    return this.updatePost(id, { published });
  }

  /**
   * Get post statistics
   */
  static async getPostStats(id: number) {
    return apiClient.get(
      `/api/posts/${id}/stats`,
      {
        tags: [CACHE_TAGS.POST(id)],
        revalidate: CACHE_TIMES.SHORT,
      },
      z.object({
        views: z.number(),
        likes: z.number(),
        comments: z.number(),
        shares: z.number(),
      })
    );
  }
}

// ============================================
// CACHE INVALIDATION HELPERS
// ============================================

/**
 * Revalidate posts cache
 */
export async function revalidatePosts() {
  const { revalidateTag } = await import('next/cache');
  revalidateTag(CACHE_TAGS.POSTS);
}

/**
 * Revalidate specific post cache
 */
export async function revalidatePost(id: number) {
  const { revalidateTag } = await import('next/cache');
  revalidateTag(CACHE_TAGS.POST(id));
  revalidateTag(CACHE_TAGS.POSTS);
}

/**
 * Revalidate all post-related caches
 */
export async function revalidateAllPosts() {
  const { revalidateTag } = await import('next/cache');
  revalidateTag(CACHE_TAGS.POSTS);
}
