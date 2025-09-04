import { apiClient, CACHE_TAGS, CACHE_TIMES } from './client';
import { User, UserSchema } from './types';
import { z } from 'zod';

// ============================================
// USERS API FUNCTIONS
// ============================================

export async function getCurrentUser() {
  return apiClient.get(
    '/api/auth/session',
    {
      tags: [CACHE_TAGS.USERS],
      revalidate: CACHE_TIMES.SHORT,
    },
    z.object({
      user: UserSchema.optional(),
    })
  );
}

export async function getUser(id: number) {
  return apiClient.get(
    `/api/users/${id}`,
    {
      tags: [CACHE_TAGS.USER(id), CACHE_TAGS.USERS],
      revalidate: CACHE_TIMES.MEDIUM,
    },
    UserSchema
  );
}

export async function getUserProfile(id: number) {
  return apiClient.get(
    `/api/users/${id}/profile`,
    {
      tags: [CACHE_TAGS.USER(id), CACHE_TAGS.USERS],
      revalidate: CACHE_TIMES.MEDIUM,
    },
    UserSchema.extend({
      _count: z.object({
        posts: z.number(),
        comments: z.number(),
      }),
      posts: z.array(z.object({
        id: z.number(),
        title: z.string(),
        published: z.boolean(),
        createdAt: z.coerce.date(),
      })).optional(),
    })
  );
}

export async function getUsers(page: number = 1, limit: number = 10) {
  const searchParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  return apiClient.get(
    `/api/users?${searchParams.toString()}`,
    {
      tags: [CACHE_TAGS.USERS],
      revalidate: CACHE_TIMES.MEDIUM,
    },
    z.array(UserSchema)
  );
}

export async function searchUsers(query: string, limit: number = 10) {
  const searchParams = new URLSearchParams({
    q: query,
    limit: limit.toString(),
  });
  
  return apiClient.get(
    `/api/users/search?${searchParams.toString()}`,
    {
      tags: [CACHE_TAGS.USERS],
      revalidate: CACHE_TIMES.SHORT,
    },
    z.array(UserSchema.pick({ id: true, name: true, email: true, image: true }))
  );
}

export async function updateUser(id: number, data: Partial<Pick<User, 'name' | 'image'>>) {
  const UpdateUserSchema = z.object({
    name: z.string().min(1).optional(),
    image: z.url().optional(),
  });
  
  const validatedData = UpdateUserSchema.parse(data);
  
  return apiClient.patch(
    `/api/users/${id}`,
    validatedData,
    {
      tags: [CACHE_TAGS.USER(id), CACHE_TAGS.USERS],
    },
    UserSchema
  );
}

export async function updateUserRole(id: number, role: 'ADMIN' | 'USER') {
  return apiClient.patch(
    `/api/users/${id}/role`,
    { role },
    {
      tags: [CACHE_TAGS.USER(id), CACHE_TAGS.USERS],
    },
    UserSchema
  );
}

export async function deleteUser(id: number) {
  return apiClient.delete(
    `/api/users/${id}`,
    {
      tags: [CACHE_TAGS.USER(id), CACHE_TAGS.USERS],
    }
  );
}

export async function getUserStats(id: number) {
  return apiClient.get(
    `/api/users/${id}/stats`,
    {
      tags: [CACHE_TAGS.USER(id)],
      revalidate: CACHE_TIMES.MEDIUM,
    },
    z.object({
      totalPosts: z.number(),
      publishedPosts: z.number(),
      totalComments: z.number(),
      joinedAt: z.coerce.date(),
      lastActive: z.coerce.date().optional(),
    })
  );
}

// ============================================
// CACHE INVALIDATION HELPERS
// ============================================

/**
 * Revalidate user cache
 */
export async function revalidateUser(id: number) {
  const { revalidateTag } = await import('next/cache');
  revalidateTag(CACHE_TAGS.USER(id));
  revalidateTag(CACHE_TAGS.USERS);
}

/**
 * Revalidate all users cache
 */
export async function revalidateAllUsers() {
  const { revalidateTag } = await import('next/cache');
  revalidateTag(CACHE_TAGS.USERS);
}
