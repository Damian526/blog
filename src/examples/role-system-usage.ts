// SIMPLE EXPLANATION: Examples of how to use the role system in your app

import { userPermissions, userStatus, getUserBadge } from '@/lib/permissions';
import { User, UserStatus, Role } from '@prisma/client';

// Example user objects for demonstration
const pendingUser: User = {
  id: 1,
  name: 'New User',
  email: 'new@example.com',
  status: UserStatus.PENDING,
  role: Role.USER,
  isExpert: false,
} as User;

const approvedUser: User = {
  id: 2,
  name: 'Community Member',
  email: 'member@example.com',
  status: UserStatus.APPROVED,
  role: Role.USER,
  isExpert: false,
} as User;

const verifiedUser: User = {
  id: 3,
  name: 'Expert Developer',
  email: 'expert@example.com',
  status: UserStatus.VERIFIED,
  role: Role.USER,
  isExpert: true,
} as User;

const adminUser: User = {
  id: 4,
  name: 'Admin',
  email: 'admin@example.com',
  status: UserStatus.VERIFIED,
  role: Role.ADMIN,
  isExpert: true,
} as User;

// EXAMPLES OF CHECKING PERMISSIONS

console.log('=== PERMISSION EXAMPLES ===');

// Can create discussions?
console.log('Can create discussions:');
console.log(
  `- Pending user: ${userPermissions.canCreateDiscussion(pendingUser)}`,
); // false
console.log(
  `- Approved user: ${userPermissions.canCreateDiscussion(approvedUser)}`,
); // true
console.log(
  `- Verified user: ${userPermissions.canCreateDiscussion(verifiedUser)}`,
); // true
console.log(`- Admin: ${userPermissions.canCreateDiscussion(adminUser)}`); // true

// Can write articles?
console.log('\nCan write articles:');
console.log(`- Pending user: ${userPermissions.canWriteArticle(pendingUser)}`); // false
console.log(
  `- Approved user: ${userPermissions.canWriteArticle(approvedUser)}`,
); // false
console.log(
  `- Verified user: ${userPermissions.canWriteArticle(verifiedUser)}`,
); // true
console.log(`- Admin: ${userPermissions.canWriteArticle(adminUser)}`); // true

// Can moderate?
console.log('\nCan moderate:');
console.log(`- Pending user: ${userPermissions.canModerate(pendingUser)}`); // false
console.log(`- Approved user: ${userPermissions.canModerate(approvedUser)}`); // false
console.log(`- Verified user: ${userPermissions.canModerate(verifiedUser)}`); // false
console.log(`- Admin: ${userPermissions.canModerate(adminUser)}`); // true

// User badges
console.log('\n=== USER BADGES ===');
console.log(`Pending user badge:`, getUserBadge(pendingUser)); // { label: 'New', color: 'gray' }
console.log(`Approved user badge:`, getUserBadge(approvedUser)); // { label: 'Member', color: 'green' }
console.log(`Verified user badge:`, getUserBadge(verifiedUser)); // { label: 'Expert', color: 'purple' }
console.log(`Admin badge:`, getUserBadge(adminUser)); // { label: 'Admin', color: 'red' }

// EXAMPLE: Using in React components
/*
function CreateDiscussionButton({ user }: { user: User }) {
  if (!userPermissions.canCreateDiscussion(user)) {
    return <p>You need to be approved to create discussions</p>;
  }
  
  return <button>Create Discussion</button>;
}

function WriteArticleButton({ user }: { user: User }) {
  if (!userPermissions.canWriteArticle(user)) {
    return <p>Only verified experts can write articles</p>;
  }
  
  return <button>Write Article</button>;
}
*/

// EXAMPLE: Using in API routes
/*
// In your API route:
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const user = await getUserFromSession(session);
  
  if (!userPermissions.canCreateDiscussion(user)) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }
  
  // Create discussion...
}
*/

// EXAMPLE: Admin actions
/*
// Approve a user
await fetch('/api/admin/users', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    userId: 123, 
    action: 'approve' 
  })
});

// Verify a user as expert
await fetch('/api/admin/users', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    userId: 123, 
    action: 'verify' 
  })
});
*/

export /* Examples for reference */ {};
