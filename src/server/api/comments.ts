import { apiClient, CACHE_TAGS, CACHE_TIMES } from './client';
import {
  Comment,
  CommentSchema,
  CreateComment,
  UpdateComment,
  CreateCommentSchema,
  UpdateCommentSchema,
} from './types';
import { z } from 'zod';

// ============================================
// COMMENTS API FUNCTIONS
// ============================================

export async function getPostComments(
  postId: number,
  includeReplies: boolean = true,
) {
  const searchParams = new URLSearchParams({
    postId: postId.toString(),
  });
  if (includeReplies) {
    searchParams.set('includeReplies', 'true');
  }

  const endpoint = `/api/comments?${searchParams.toString()}`;

  return apiClient.get(
    endpoint,
    {
      cache: 'no-store', // No server-side caching for real-time comments
    },
    z.array(CommentSchema),
  );
}

export async function getComment(id: number) {
  return apiClient.get(
    `/api/comments/${id}`,
    {
      cache: 'no-store', // No server-side caching for real-time comments
    },
    CommentSchema,
  );
}

export async function getUserComments(
  userId: number,
  page: number = 1,
  limit: number = 10,
) {
  const searchParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  return apiClient.get(
    `/api/users/${userId}/comments?${searchParams.toString()}`,
    {
      cache: 'no-store', // No server-side caching for real-time comments
    },
    z.array(CommentSchema),
  );
}

export async function getCommentReplies(commentId: number) {
  return apiClient.get(
    `/api/comments/${commentId}/replies`,
    {
      cache: 'no-store', // No server-side caching for real-time comments
    },
    z.array(CommentSchema),
  );
}

export async function createComment(data: CreateComment) {
  const validatedData = CreateCommentSchema.parse(data);

  return apiClient.post(
    '/api/comments',
    validatedData,
    {
      cache: 'no-store', // No caching for mutations
    },
    CommentSchema,
  );
}

export async function replyToComment(
  parentId: number,
  postId: number,
  content: string,
) {
  const data = {
    content,
    postId,
    parentId,
  };

  return apiClient.post(
    '/api/comments/reply',
    data,
    {
      cache: 'no-store', // No caching for mutations
    },
    CommentSchema,
  );
}

export async function updateComment(id: number, data: UpdateComment) {
  const validatedData = UpdateCommentSchema.parse(data);

  return apiClient.patch(
    `/api/comments/${id}`,
    validatedData,
    {
      cache: 'no-store', // No caching for mutations
    },
    CommentSchema,
  );
}

export async function deleteComment(id: number) {
  return apiClient.delete(`/api/comments/${id}`, {
    cache: 'no-store', // No caching for mutations
  });
}

/**
 * Get comment thread (comment and all its nested replies)
 */
export async function getCommentThread(commentId: number) {
  return apiClient.get(
    `/api/comments/${commentId}/thread`,
    {
      cache: 'no-store', // No server-side caching for real-time comments
    },
    CommentSchema,
  );
}

export async function getCommentStats(commentId: number) {
  return apiClient.get(
    `/api/comments/${commentId}/stats`,
    {
      cache: 'no-store', // No server-side caching for real-time comments
    },
    z.object({
      replies: z.number(),
      likes: z.number(),
      dislikes: z.number(),
    }),
  );
}

// ============================================
// CACHE INVALIDATION HELPERS
// ============================================

export async function revalidatePostComments(postId: number) {
  const { revalidateTag } = await import('next/cache');
  revalidateTag(CACHE_TAGS.POST_COMMENTS(postId));
  revalidateTag(CACHE_TAGS.COMMENTS);
}

export async function revalidateComment(id: number) {
  const { revalidateTag } = await import('next/cache');
  revalidateTag(CACHE_TAGS.COMMENT(id));
  revalidateTag(CACHE_TAGS.COMMENTS);
}

export async function revalidateAllComments() {
  const { revalidateTag } = await import('next/cache');
  revalidateTag(CACHE_TAGS.COMMENTS);
}
