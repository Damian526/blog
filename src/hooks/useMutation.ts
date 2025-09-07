// ============================================
// CORE MUTATION HOOK - SHARED UTILITY
// ============================================

import { useState, useCallback } from 'react';

interface MutationOptions<T, P> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  optimisticUpdate?: (params: P) => void;
  revalidate?: () => void;
}

export function useMutation<T, P>(
  mutationFn: (params: P) => Promise<T>,
  options: MutationOptions<T, P> = {}
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (params: P) => {
    setIsLoading(true);
    setError(null);

    // Apply optimistic update
    if (options.optimisticUpdate) {
      options.optimisticUpdate(params);
    }

    try {
      const result = await mutationFn(params);
      if (options.onSuccess) {
        options.onSuccess(result);
      }
      if (options.revalidate) {
        options.revalidate();
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      
      if (options.onError) {
        options.onError(error);
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [mutationFn, options]);

  return { mutate, isLoading, error };
}
