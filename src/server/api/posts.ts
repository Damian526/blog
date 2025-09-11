import { apiClient } from './client';
import {
  Post,
  PostSchema,
  PostSummary,
  PostSummarySchema,
  CreatePost,
  UpdatePost,
  PostFilters,
  PostFiltersSchema,
  CreatePostSchema,
  UpdatePostSchema,
} from './types';
import { z } from 'zod';

export async function getPosts(filters: Partial<PostFilters> = {}) {
  const validatedFilters = PostFiltersSchema.parse(filters);

  const searchParams = new URLSearchParams();

  if (validatedFilters.published !== undefined) {
    searchParams.set('published', validatedFilters.published.toString());
  }
  if (validatedFilters.categoryIds?.length) {
    searchParams.set('categoryIds', validatedFilters.categoryIds.join(','));
  }
  if (validatedFilters.subcategoryIds?.length) {
    searchParams.set(
      'subcategoryIds',
      validatedFilters.subcategoryIds.join(','),
    );
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

  // ✅ NO server-side caching - let SWR handle everything!
  return apiClient.get(endpoint, { cache: 'no-store' }, z.array(PostSummarySchema));
}

export async function getPost(id: number) {
  // ✅ NO server-side caching - let SWR handle everything!
  return apiClient.get(
    `/api/posts/${id}`,
    { cache: 'no-store' },
    PostSchema,
  );
}

export async function getPostsByAuthor(
  authorId: number,
  filters: Partial<PostFilters> = {},
) {
  return getPosts({
    ...filters,
    authorId,
  });
}

export async function getPublishedPosts(filters: Partial<PostFilters> = {}) {
  return getPosts({
    ...filters,
    published: true,
  });
}

export async function searchPosts(
  query: string,
  filters: Partial<PostFilters> = {},
) {
  return getPosts({
    ...filters,
    search: query,
  });
}

// Note: createPost, updatePost, deletePost are now server actions in /lib/actions/posts.ts
// Use those for mutations instead of API calls

export async function getPostStats(id: number) {
  // ✅ NO server-side caching - let SWR handle everything!
  return apiClient.get(
    `/api/posts/${id}/stats`,
    { cache: 'no-store' },
    z.object({
      views: z.number(),
      likes: z.number(),
      comments: z.number(),
      shares: z.number(),
    }),
  );
}

// ✅ Removed revalidatePosts - SWR handles revalidation automatically
// Use mutate() from SWR hooks instead

// ✅ Removed all revalidation functions - SWR handles this automatically
// Use mutate() from individual SWR hooks for manual revalidation
