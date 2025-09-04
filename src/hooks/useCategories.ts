import useSWR from 'swr';
import { Category, Subcategory } from '@/server/api';

interface CategoryWithSubcategories extends Category {
  subcategories: Subcategory[];
}

export function useCategories() {
  const {
    data: categories,
    error,
    isLoading,
    mutate,
  } = useSWR<CategoryWithSubcategories[]>(
    'categories',
    async () => {
      const { api } = await import('@/server/api');
      return api.categories.getAll();
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      shouldRetryOnError: false,
      // Categories don't change often, so we can cache them longer
      dedupingInterval: 300000, // 5 minutes
    }
  );

  const createCategory = async (name: string) => {
    try {
      const { api } = await import('@/server/api');
      const newCategory = await api.categories.create(name);
      mutate(); // Revalidate to get fresh data
      return newCategory;
    } catch (error) {
      throw error;
    }
  };

  const createSubcategory = async (name: string, categoryId: number) => {
    try {
      const { api } = await import('@/server/api');
      const newSubcategory = await api.categories.createSubcategory(name, categoryId);
      mutate(); // Revalidate to get fresh data
      return newSubcategory;
    } catch (error) {
      throw error;
    }
  };

  const updateCategory = async (id: number, name: string) => {
    if (!categories) return;

    // Optimistic update
    const originalCategories = [...categories];
    const updatedCategories = categories.map(cat => 
      cat.id === id ? { ...cat, name } : cat
    );
    mutate(updatedCategories, false);

    try {
      const { api } = await import('@/server/api');
      const updatedCategory = await api.categories.update(id, name);
      mutate(); // Revalidate to get fresh data
      return updatedCategory;
    } catch (error) {
      mutate(originalCategories, false); // Revert on error
      throw error;
    }
  };

  const deleteCategory = async (id: number) => {
    if (!categories) return;

    // Optimistic update
    const originalCategories = [...categories];
    const updatedCategories = categories.filter(cat => cat.id !== id);
    mutate(updatedCategories, false);

    try {
      const { api } = await import('@/server/api');
      await api.categories.delete(id);
      mutate(); // Revalidate to get fresh data
    } catch (error) {
      mutate(originalCategories, false); // Revert on error
      throw error;
    }
  };

  return {
    categories: categories || [],
    error,
    isLoading,
    mutate,
    createCategory,
    createSubcategory,
    updateCategory,
    deleteCategory,
    refetch: () => mutate(),
  };
}
