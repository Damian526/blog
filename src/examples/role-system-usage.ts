// SIMPLE EXPLANATION: Examples of how to use the role system in your app

import {
  canCreatePost,
  canCreateDiscussion,
  getUserBadge,
} from '@/lib/permissions';
import { User, Role } from '@prisma/client';

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
  posts: [],
  discussions: [],
  comments: [],
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
  posts: [],
  discussions: [],
  comments: [],
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
  posts: [],
  discussions: [],
  comments: [],
  createdAt: new Date(),
  role: Role.USER,
  verificationToken: null,
};

// Usage examples
console.log('🔍 Testing Permission System');

console.log('\n👤 Pending User (John):');
console.log('Can create posts:', canCreatePost(pendingUser)); // false
console.log('Can create discussions:', canCreateDiscussion(pendingUser)); // false
console.log('Badge:', getUserBadge(pendingUser)); // "⏳ Pending Approval"

console.log('\n✅ Verified User (Jane):');
console.log('Can create posts:', canCreatePost(verifiedUser)); // true
console.log('Can create discussions:', canCreateDiscussion(verifiedUser)); // true
console.log('Badge:', getUserBadge(verifiedUser)); // "✅ Community Member"

console.log('\n⭐ Expert User (Bob):');
console.log('Can create posts:', canCreatePost(expertUser)); // true
console.log('Can create discussions:', canCreateDiscussion(expertUser)); // true
console.log('Badge:', getUserBadge(expertUser)); // "⭐ Verified Expert"

// Example API usage
export async function checkUserPermissions(user: User) {
  if (!canCreatePost(user)) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }
  // Continue with post creation...
}

export /* Examples for reference */ {};
