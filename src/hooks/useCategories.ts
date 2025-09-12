import useSWR from 'swr';
import { api } from '@/server/api';
import type { Category } from '@/server/api/types';

/**
 * Hook for fetching categories using SWR (Client-Side Rendering)
 * Use this hook in client components that need categories with interactivity.
 * For server components, use getCategories() from @/lib/queries/categories
 */
export function useCategories() {
  const { data, error, isLoading, mutate } = useSWR(
    'categories',
    () => api.categories.getAll(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 3600000, // 1 hour - categories don't change often
    },
  );

  return {
    categories: data || [],
    error,
    isLoading,
    refetch: mutate,
  };
}
