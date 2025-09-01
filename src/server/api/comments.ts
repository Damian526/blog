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
// COMMENTS API SERVICE
// ============================================

export class CommentsApi {
  /**
   * Get comments for a specific post
   */
  static async getPostComments(postId: number, includeReplies: boolean = true) {
    const searchParams = new URLSearchParams();
    if (includeReplies) {
      searchParams.set('includeReplies', 'true');
    }
    
    const endpoint = `/api/posts/${postId}/comments?${searchParams.toString()}`;
    
    return apiClient.get(
      endpoint,
      {
        tags: [CACHE_TAGS.POST_COMMENTS(postId), CACHE_TAGS.COMMENTS],
        revalidate: CACHE_TIMES.SHORT,
      },
      z.array(CommentSchema)
    );
  }

  /**
   * Get a single comment by ID
   */
  static async getComment(id: number) {
    return apiClient.get(
      `/api/comments/${id}`,
      {
        tags: [CACHE_TAGS.COMMENT(id), CACHE_TAGS.COMMENTS],
        revalidate: CACHE_TIMES.SHORT,
      },
      CommentSchema
    );
  }

  /**
   * Get comments by user
   */
  static async getUserComments(userId: number, page: number = 1, limit: number = 10) {
    const searchParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    return apiClient.get(
      `/api/users/${userId}/comments?${searchParams.toString()}`,
      {
        tags: [CACHE_TAGS.USER(userId), CACHE_TAGS.COMMENTS],
        revalidate: CACHE_TIMES.SHORT,
      },
      z.array(CommentSchema)
    );
  }

  /**
   * Get replies to a specific comment
   */
  static async getCommentReplies(commentId: number) {
    return apiClient.get(
      `/api/comments/${commentId}/replies`,
      {
        tags: [CACHE_TAGS.COMMENT(commentId), CACHE_TAGS.COMMENTS],
        revalidate: CACHE_TIMES.SHORT,
      },
      z.array(CommentSchema)
    );
  }

  /**
   * Create a new comment
   */
  static async createComment(data: CreateComment) {
    const validatedData = CreateCommentSchema.parse(data);
    
    return apiClient.post(
      '/api/comments',
      validatedData,
      {
        tags: [
          CACHE_TAGS.POST_COMMENTS(validatedData.postId),
          CACHE_TAGS.COMMENTS,
        ],
      },
      CommentSchema
    );
  }

  /**
   * Reply to a comment
   */
  static async replyToComment(parentId: number, postId: number, content: string) {
    const data: CreateComment = {
      content,
      postId,
      parentId,
    };
    
    return this.createComment(data);
  }

  /**
   * Update an existing comment
   */
  static async updateComment(id: number, data: UpdateComment) {
    const validatedData = UpdateCommentSchema.parse(data);
    
    return apiClient.patch(
      `/api/comments/${id}`,
      validatedData,
      {
        tags: [CACHE_TAGS.COMMENT(id), CACHE_TAGS.COMMENTS],
      },
      CommentSchema
    );
  }

  /**
   * Delete a comment
   */
  static async deleteComment(id: number) {
    return apiClient.delete(
      `/api/comments/${id}`,
      {
        tags: [CACHE_TAGS.COMMENT(id), CACHE_TAGS.COMMENTS],
      }
    );
  }

  /**
   * Get comment thread (comment and all its nested replies)
   */
  static async getCommentThread(commentId: number) {
    return apiClient.get(
      `/api/comments/${commentId}/thread`,
      {
        tags: [CACHE_TAGS.COMMENT(commentId), CACHE_TAGS.COMMENTS],
        revalidate: CACHE_TIMES.SHORT,
      },
      CommentSchema
    );
  }

  /**
   * Get comment statistics
   */
  static async getCommentStats(commentId: number) {
    return apiClient.get(
      `/api/comments/${commentId}/stats`,
      {
        tags: [CACHE_TAGS.COMMENT(commentId)],
        revalidate: CACHE_TIMES.SHORT,
      },
      z.object({
        replies: z.number(),
        likes: z.number(),
        dislikes: z.number(),
      })
    );
  }
}

// ============================================
// CACHE INVALIDATION HELPERS
// ============================================

/**
 * Revalidate comments cache for a specific post
 */
export async function revalidatePostComments(postId: number) {
  const { revalidateTag } = await import('next/cache');
  revalidateTag(CACHE_TAGS.POST_COMMENTS(postId));
  revalidateTag(CACHE_TAGS.COMMENTS);
}

/**
 * Revalidate specific comment cache
 */
export async function revalidateComment(id: number) {
  const { revalidateTag } = await import('next/cache');
  revalidateTag(CACHE_TAGS.COMMENT(id));
  revalidateTag(CACHE_TAGS.COMMENTS);
}

/**
 * Revalidate all comments cache
 */
export async function revalidateAllComments() {
  const { revalidateTag } = await import('next/cache');
  revalidateTag(CACHE_TAGS.COMMENTS);
}
