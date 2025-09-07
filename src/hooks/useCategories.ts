// ============================================
// CATEGORIES HOOKS
// ============================================

import useSWR from 'swr';
import { api } from '@/server/api';
import { useMutation } from './useMutation';
import type { Category } from '@/server/api/types';

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

  const createCategory = useMutation(
    (name: string) => api.categories.create(name),
    {
      revalidate: () => mutate(),
    }
  );

  return {
    categories: data || [],
    error,
    isLoading,
    createCategory: createCategory.mutate,
    isCreating: createCategory.isLoading,
    refetch: mutate,
  };
}
