// SIMPLE EXPLANATION: Examples of how to use the role system in your app

import {
  canCreatePost,
  canCreateDiscussion,
  getUserBadge,
} from '@/lib/permissions';
// import { User, Role } from '@prisma/client';
import { NextResponse } from 'next/server';

// Temporary type definitions to avoid Prisma client issues
type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  profilePicture: string | null;
  verified: boolean;
  isExpert: boolean;
  verificationReason: string | null;
  portfolioUrl: string | null;
  approvedBy: number | null;
  approvedAt: Date | null;
  createdAt: Date;
  role: 'ADMIN' | 'USER';
  verificationToken: string | null;
};

enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

// Example users for testing
const pendingUser: User = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  password: 'hashedpassword',
  profilePicture: null,
  verified: false,
  isExpert: false,
  verificationReason: null,
  portfolioUrl: null,
  approvedBy: null,
  approvedAt: null,
  createdAt: new Date(),
  role: Role.USER,
  verificationToken: null,
};

const verifiedUser: User = {
  id: 2,
  name: 'Jane Smith',
  email: 'jane@example.com',
  password: 'hashedpassword',
  profilePicture: null,
  verified: true,
  isExpert: false,
  verificationReason: null,
  portfolioUrl: null,
  approvedBy: 1,
  approvedAt: new Date(),
  createdAt: new Date(),
  role: Role.USER,
  verificationToken: null,
};

const expertUser: User = {
  id: 3,
  name: 'Bob Expert',
  email: 'bob@example.com',
  password: 'hashedpassword',
  profilePicture: null,
  verified: true,
  isExpert: true,
  verificationReason: 'Frontend expert with 10 years experience',
  portfolioUrl: 'https://github.com/bobexpert',
  approvedBy: 1,
  approvedAt: new Date(),
  createdAt: new Date(),
  role: Role.USER,
  verificationToken: null,
};

// Usage examples
console.log('🔍 Testing Permission System');

console.log('\n👤 Pending User (John):');
console.log('Can create posts:', canCreatePost(pendingUser)); // false
console.log('Can create discussions:', canCreateDiscussion(pendingUser)); // false
console.log('Badge:', getUserBadge(pendingUser)); // { label: 'New', color: 'gray' }

console.log('\n✅ Verified User (Jane):');
console.log('Can create posts:', canCreatePost(verifiedUser)); // true
console.log('Can create discussions:', canCreateDiscussion(verifiedUser)); // true
console.log('Badge:', getUserBadge(verifiedUser)); // { label: 'Member', color: 'green' }

console.log('\n⭐ Expert User (Bob):');
console.log('Can create posts:', canCreatePost(expertUser)); // true
console.log('Can create discussions:', canCreateDiscussion(expertUser)); // true
console.log('Badge:', getUserBadge(expertUser)); // { label: 'Expert', color: 'purple' }

// Example API usage
export async function checkUserPermissions(user: User) {
  if (!canCreatePost(user)) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }
  // Continue with post creation...
}

export /* Examples for reference */ {};
