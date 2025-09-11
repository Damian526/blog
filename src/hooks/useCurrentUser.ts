import { useSession } from 'next-auth/react';
import { useTransition } from 'react';
import { updateUserProfile, requestExpertVerification } from '@/lib/actions/users';
import type { User } from '@prisma/client';

export function useCurrentUser() {
  const { data: session, status, update } = useSession();
  const [isPending, startTransition] = useTransition();

  const updateProfile = async (profileData: { 
    name?: string; 
    email?: string; 
    profilePicture?: string;
    verificationReason?: string;
    portfolioUrl?: string;
  }) => {
    return new Promise((resolve, reject) => {
      startTransition(async () => {
        try {
          const result = await updateUserProfile(profileData);
          if (result.success) {
            // Update the session to reflect the changes
            await update();
            resolve(result);
          } else {
            reject(new Error(result.error));
          }
        } catch (error) {
          reject(error);
        }
      });
    });
  };

  const requestVerification = async (data: {
    verificationReason: string;
    portfolioUrl: string;
  }) => {
    return new Promise((resolve, reject) => {
      startTransition(async () => {
        try {
          const result = await requestExpertVerification(data);
          if (result.success) {
            // Update the session to reflect the changes
            await update();
            resolve(result);
          } else {
            reject(new Error(result.error));
          }
        } catch (error) {
          reject(error);
        }
      });
    });
  };

  return {
    user: session?.user || null,
    error: status === 'unauthenticated' ? new Error('Not authenticated') : null,
    isLoading: status === 'loading',
    updateProfile,
    requestVerification,
    isUpdating: isPending,
    refetch: update,
    isAuthenticated: status === 'authenticated',
  };
}

export function useUser(userId: number | null) {
  // For now, this is a placeholder since we removed the user API endpoints
  // If needed, we can create a specific API endpoint or server action for this
  return {
    user: null,
    error: new Error('useUser hook not implemented - use specific queries instead'),
    isLoading: false,
    refetch: () => {},
  };
}

export { useCurrentUser as useAuth };
