import { apiClient, CACHE_TAGS, CACHE_TIMES } from './client';
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

  return apiClient.get(endpoint, undefined, z.array(PostSummarySchema));
}

export async function getPost(id: number) {
  return apiClient.get(
    `/api/posts/${id}`,
    {
      tags: [CACHE_TAGS.POST(id), CACHE_TAGS.POSTS],
      revalidate: CACHE_TIMES.MEDIUM,
    },
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

export async function createPost(data: CreatePost) {
  const validatedData = CreatePostSchema.parse(data);

  return apiClient.post(
    '/api/posts',
    validatedData,
    {
      tags: [CACHE_TAGS.POSTS],
    },
    PostSchema,
  );
}

export async function updatePost(id: number, data: UpdatePost) {
  const validatedData = UpdatePostSchema.parse(data);

  return apiClient.patch(
    `/api/posts/${id}`,
    validatedData,
    {
      tags: [CACHE_TAGS.POST(id), CACHE_TAGS.POSTS],
    },
    PostSchema,
  );
}

export async function deletePost(id: number) {
  return apiClient.delete(`/api/posts/${id}`, {
    tags: [CACHE_TAGS.POST(id), CACHE_TAGS.POSTS],
  });
}

export async function togglePublished(id: number, published: boolean) {
  return updatePost(id, { published });
}

export async function getPostStats(id: number) {
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
    }),
  );
}

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
