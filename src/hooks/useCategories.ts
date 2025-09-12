import useSWR from 'swr';
import { api } from '@/server/api';
import type { Category } from '@/server/api/types';

/**
 * DEPRECATED: Use SSG (getCategories from queries/categories.ts) instead!
 * Categories rarely change and should be fetched at build time for optimal performance.
 * This hook should only be used as a fallback for client-side updates if absolutely necessary.
 */
export function useCategories() {
  const { data, error, isLoading, mutate } = useSWR(
    'categories',
    () => api.categories.getAll(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 3600000, // 1 hour - categories don't change often
    }
  );

  return {
    categories: data || [],
    error,
    isLoading,
    refetch: mutate,
  };
}
