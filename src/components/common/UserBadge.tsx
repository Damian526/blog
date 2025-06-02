// SIMPLE EXPLANATION: Component to show user status badges (Admin, Expert, Member, etc.)

import React from 'react';
import { User } from '@prisma/client';
import { getUserBadge } from '@/lib/permissions';

interface UserBadgeProps {
  user: User;
  showText?: boolean; // Show badge text or just color indicator
}

export default function UserBadge({ user, showText = true }: UserBadgeProps) {
  const badge = getUserBadge(user);

  // Simple color classes (you can replace with your styling system)
  const colorClasses = {
    red: 'bg-red-100 text-red-800 border-red-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
    green: 'bg-green-100 text-green-800 border-green-200',
    gray: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  if (!showText) {
    // Just a small colored dot
    return (
      <span
        className={`inline-block w-2 h-2 rounded-full ${colorClasses[badge.color].split(' ')[0]}`}
        title={badge.label}
      />
    );
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${colorClasses[badge.color]}`}
    >
      {badge.label}
    </span>
  );
}

// Helper component for user display with name and badge
export function UserWithBadge({ user }: { user: User }) {
  return (
    <div className="flex items-center space-x-2">
      <span className="font-medium">{user.name}</span>
      <UserBadge user={user} />
    </div>
  );
}
