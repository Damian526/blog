// SIMPLE EXPLANATION: This file contains simple functions to check what users can do
// Based on their verified status and role

import { User, Role } from '@prisma/client';

// Who can create posts - verified users and admins
export const canCreatePost = (user?: User | null): boolean => {
  if (!user) return false;
  return user.verified || user.role === Role.ADMIN;
};

// Who can create articles (expert content) - verified users and admins
export const canCreateArticle = (user?: User | null): boolean => {
  if (!user) return false;
  return user.verified || user.role === Role.ADMIN;
};

// Who can create discussions - all verified users and admins
export const canCreateDiscussion = (user?: User | null): boolean => {
  if (!user) return false;
  return user.verified || user.role === Role.ADMIN;
};

// Who can create comments - all verified users and admins
export const canCreateComment = (user?: User | null): boolean => {
  if (!user) return false;
  return user.verified || user.role === Role.ADMIN;
};

// Who can view content - all users (no restrictions for viewing)
export const canViewContent = (user?: User | null): boolean => {
  return true; // Everyone can view
};

// Who can edit their own content
export const canEditOwnContent = (
  user?: User | null,
  authorId?: number,
): boolean => {
  if (!user || !authorId) return false;
  return user.id === authorId || user.role === Role.ADMIN;
};

// Who can moderate (approve/reject posts)
export const canModerate = (user?: User | null): boolean => {
  if (!user) return false;
  return user.role === Role.ADMIN;
};

// Simple verification check functions
export const userStatus = {
  isPending: (user?: User | null) =>
    !user?.verified && !user?.verificationReason,
  isApproved: (user?: User | null) =>
    user?.verified === false && !user?.verificationReason,
  isVerified: (user?: User | null) => user?.verified === true,
};

// Status labels for UI
export const statusLabels = {
  pending: 'Pending Approval',
  approved: 'Community Member',
  verified: 'Verified Expert',
};

// Get user badge/label
export const getUserBadge = (user?: User | null): { label: string; color: 'red' | 'purple' | 'green' | 'gray' } => {
  if (!user) return { label: 'Guest', color: 'gray' };
  
  if (user.role === 'ADMIN') return { label: 'Admin', color: 'red' };
  if (user.verified && user.isExpert) return { label: 'Expert', color: 'purple' };
  if (user.verified) return { label: 'Member', color: 'green' };
  
  return { label: 'New', color: 'gray' };
};
