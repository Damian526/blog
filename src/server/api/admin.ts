import { apiClient, CACHE_TAGS, CACHE_TIMES } from './client';
import { User, UserSchema, Post, PostSchema } from './types';
import { z } from 'zod';

export async function getAdminStats() {
  return apiClient.get(
    '/api/admin/stats',
    {
      cache: 'no-store', // Always get fresh admin data
    },
    z.object({
      users: z.object({
        total: z.number(),
        pending: z.number(),
        applications: z.number(),
      }),
      posts: z.object({
        total: z.number(),
        published: z.number(),
        pending: z.number(),
      }).optional(),
    })
  );
}

/**
 * Get all users for admin management
 */
export async function getAdminUsers() {
  return apiClient.get(
    '/api/admin/users',
    {
      cache: 'no-store', // Always get fresh user data
    },
    z.array(UserSchema.extend({
      _count: z.object({
        posts: z.number(),
        comments: z.number(),
      }).optional(),
    }))
  );
}

/**
 * Approve a user account
 */
export async function approveUser(userId: number) {
  return apiClient.patch(
    `/api/admin/users/${userId}/approve`,
    {},
    {
      tags: [CACHE_TAGS.USERS, CACHE_TAGS.USER(userId)],
    },
    z.object({
      message: z.string(),
    })
  );
}

/**
 * Reject a user account
 */
export async function rejectUser(userId: number, reason?: string) {
  return apiClient.patch(
    `/api/admin/users/${userId}/reject`,
    { reason },
    {
      tags: [CACHE_TAGS.USERS, CACHE_TAGS.USER(userId)],
    },
    z.object({
      message: z.string(),
    })
  );
}

/**
 * Delete a user account (admin)
 */
export async function adminDeleteUser(userId: number) {
  return apiClient.delete(
    `/api/admin/users/${userId}`,
    {
      tags: [CACHE_TAGS.USERS, CACHE_TAGS.USER(userId)],
    },
    z.object({
      message: z.string(),
    })
  );
}

/**
 * Update user role (admin)
 */
export async function adminUpdateUserRole(userId: number, role: 'ADMIN' | 'USER') {
  return apiClient.patch(
    `/api/admin/users/${userId}/role`,
    { role },
    {
      tags: [CACHE_TAGS.USERS, CACHE_TAGS.USER(userId)],
    },
    UserSchema
  );
}

/**
 * Publish a post
 */
export async function publishPost(postId: number) {
  return apiClient.post(
    '/api/admin/posts/publish',
    { postId },
    {
      tags: [CACHE_TAGS.POSTS, CACHE_TAGS.POST(postId)],
    },
    z.object({
      message: z.string(),
    })
  );
}

/**
 * Reject a post
 */
export async function rejectPost(postId: number, reason?: string) {
  return apiClient.post(
    '/api/admin/posts/reject',
    { postId, reason },
    {
      tags: [CACHE_TAGS.POSTS, CACHE_TAGS.POST(postId)],
    },
    z.object({
      message: z.string(),
    })
  );
}

/**
 * Get all posts for admin review
 */
export async function getAdminPosts() {
  return apiClient.get(
    '/api/admin/posts',
    {
      cache: 'no-store', // Always get fresh post data
    },
    z.array(PostSchema.extend({
      author: UserSchema,
      _count: z.object({
        comments: z.number(),
      }).optional(),
    }))
  );
}

// ============================================
// CACHE INVALIDATION HELPERS
// ============================================

export async function revalidateAdminData() {
  const { revalidateTag } = await import('next/cache');
  revalidateTag(CACHE_TAGS.USERS);
  revalidateTag(CACHE_TAGS.POSTS);
}
