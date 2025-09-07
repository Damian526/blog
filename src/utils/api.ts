import { api } from '@/server/api';

export async function getUser(userId: number) {
  return api.users.getById(userId);
}

export async function getUserProfile(userId: number) {
  return api.users.getProfile(userId);
}

export async function getUserStats(userId: number) {
  return api.users.getStats(userId);
}

export async function searchUsers(query: string, limit: number = 10) {
  if (query.length < 2) return [];
  return api.users.search(query, limit);
}
