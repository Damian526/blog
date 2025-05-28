import useSWR from 'swr';

interface User {
  name?: string;
  email: string;
  role?: 'ADMIN' | 'USER';
}

interface SessionData {
  user?: User;
}

export function useCurrentUser() {
  const {
    data: sessionData,
    error,
    isLoading,
    mutate,
  } = useSWR<SessionData>('/api/auth/session', {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    shouldRetryOnError: false,
    // Session data can be cached for a reasonable time
    dedupingInterval: 30000, // 30 seconds
  });

  return {
    user: sessionData?.user || null,
    isLoggedIn: !!sessionData?.user,
    error,
    isLoading,
    mutate,
  };
}
