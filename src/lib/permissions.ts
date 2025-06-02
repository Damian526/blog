// SIMPLE EXPLANATION: This file contains simple functions to check what users can do
// Based on their status and role

import { User, UserStatus, Role } from '@prisma/client';

// Simple permission checker functions
export const userPermissions = {
  // Can user read content?
  canRead: (user?: User | null) => {
    return true; // Everyone can read (even guests)
  },

  // Can user create discussions?
  canCreateDiscussion: (user?: User | null) => {
    if (!user) return false;
    return (
      user.status === UserStatus.APPROVED ||
      user.status === UserStatus.VERIFIED ||
      user.role === Role.ADMIN
    );
  },

  // Can user write articles?
  canWriteArticle: (user?: User | null) => {
    if (!user) return false;
    return user.status === UserStatus.VERIFIED || user.role === Role.ADMIN;
  },

  // Can user comment?
  canComment: (user?: User | null) => {
    if (!user) return false;
    return (
      user.status === UserStatus.APPROVED ||
      user.status === UserStatus.VERIFIED ||
      user.role === Role.ADMIN
    );
  },

  // Is user admin?
  isAdmin: (user?: User | null) => {
    return user?.role === Role.ADMIN;
  },

  // Can user moderate content?
  canModerate: (user?: User | null) => {
    return user?.role === Role.ADMIN;
  },

  // Can user approve other users?
  canApproveUsers: (user?: User | null) => {
    return user?.role === Role.ADMIN;
  },

  // Can user edit their own content?
  canEditOwn: (user?: User | null, authorId?: number) => {
    if (!user || !authorId) return false;
    return user.id === authorId || user.role === Role.ADMIN;
  },
};

// Simple status check functions
export const userStatus = {
  isPending: (user?: User | null) => user?.status === UserStatus.PENDING,
  isApproved: (user?: User | null) => user?.status === UserStatus.APPROVED,
  isVerified: (user?: User | null) => user?.status === UserStatus.VERIFIED,
  isExpert: (user?: User | null) => user?.isExpert === true,
};

// Simple role descriptions for UI
export const roleLabels = {
  [UserStatus.PENDING]: 'Pending Approval',
  [UserStatus.APPROVED]: 'Community Member',
  [UserStatus.VERIFIED]: 'Verified Expert',
  [Role.ADMIN]: 'Administrator',
  [Role.USER]: 'User',
} as const;

// Get user display badge
export const getUserBadge = (user: User) => {
  if (user.role === Role.ADMIN) return { label: 'Admin', color: 'red' };
  if (user.status === UserStatus.VERIFIED)
    return { label: 'Expert', color: 'purple' };
  if (user.status === UserStatus.APPROVED)
    return { label: 'Member', color: 'green' };
  return { label: 'New', color: 'gray' };
};
