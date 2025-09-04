import useSWR from 'swr';
import { User, api } from '@/server/api';

interface SessionData {
  user?: User;
}

export function useCurrentUser() {
  const {
    data: sessionData,
    error,
    isLoading,
    mutate,
  } = useSWR<SessionData>(
    'current-user',
    () => api.users.getCurrent(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      shouldRetryOnError: false,
      // Session data can be cached for a reasonable time
      dedupingInterval: 30000, // 30 seconds
    }
  );

  const updateUser = async (updateData: Partial<Pick<User, 'name' | 'image'>>) => {
    if (!sessionData?.user) throw new Error('No user to update');

    // Optimistic update
    const originalSession = { ...sessionData };
    mutate({
      user: { ...sessionData.user, ...updateData }
    }, false);

    try {
      const updatedUser = await api.users.update(sessionData.user.id, updateData);
      mutate({ user: updatedUser }, false);
      return updatedUser;
    } catch (error) {
      mutate(originalSession, false); // Revert on error
      throw error;
    }
  };

  return {
    user: sessionData?.user || null,
    isLoggedIn: !!sessionData?.user,
    error,
    isLoading,
    mutate,
    updateUser,
  };
}
