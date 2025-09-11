import { apiClient } from './client';
import type { Comment } from './types';
import { z } from 'zod';

export interface CreateCommentRequest {
  content: string;
  postId: number;
  parentId?: number;
}

export interface UpdateCommentRequest {
  content: string;
}

// Define schemas for validation
const CommentSchema = z.object({
  id: z.number(),
  content: z.string(),
  postId: z.number(),
  authorId: z.number(),
  parentId: z.number().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  author: z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
    image: z.string().nullable(),
    createdAt: z.string(),
  }),
  replies: z.array(z.lazy(() => CommentSchema)).optional(),
});

export async function getCommentsByPost(postId: number, includeReplies: boolean = true): Promise<Comment[]> {
  return apiClient.get(
    `/api/comments?postId=${postId}&includeReplies=${includeReplies}`,
    { cache: 'no-store' },
    z.array(CommentSchema)
  );
}

export async function createComment(data: CreateCommentRequest): Promise<Comment> {
  return apiClient.post('/api/comments', data, { cache: 'no-store' }, CommentSchema);
}

export async function updateComment(id: number, data: UpdateCommentRequest): Promise<Comment> {
  return apiClient.patch(`/api/comments/${id}`, data, { cache: 'no-store' }, CommentSchema);
}

export async function deleteComment(id: number): Promise<{ success: boolean }> {
  return apiClient.delete(`/api/comments/${id}`, { cache: 'no-store' }, z.object({ success: z.boolean() }));
}

export async function getCommentReplies(commentId: number): Promise<Comment[]> {
  return apiClient.get(
    `/api/comments/reply?commentId=${commentId}`,
    { cache: 'no-store' },
    z.array(CommentSchema)
  );
}
