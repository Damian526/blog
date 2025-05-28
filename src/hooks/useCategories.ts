import useSWR from 'swr';

interface Category {
  id: number;
  name: string;
  subcategories: { id: number; name: string }[];
}

export function useCategories() {
  const {
    data: categories,
    error,
    isLoading,
    mutate,
  } = useSWR<Category[]>('/api/categories', {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    shouldRetryOnError: false,
    // Categories don't change often, so we can cache them longer
    dedupingInterval: 60000, // 1 minute
  });

  return {
    categories: categories || [],
    error,
    isLoading,
    mutate,
  };
}
