# Migration Guide: Status to Verified

This guide documents the changes made to replace the `status` field with the `verified` boolean field.

## Database Changes

Run this SQL when your database is available:

```sql
-- Remove the status column from the User table
ALTER TABLE "User" DROP COLUMN IF EXISTS "status";

-- Drop the UserStatus enum type
DROP TYPE IF EXISTS "UserStatus";
```

## Code Changes Made

### 1. Schema Changes (`prisma/schema.prisma`)

- ✅ Removed `status` field from User model
- ✅ Removed `UserStatus` enum
- ✅ Kept `verified` boolean field (default: false)
- ✅ Kept `isExpert` boolean field for expert users

### 2. Permissions System (`src/lib/permissions.ts`)

- ✅ Replaced `userPermissions` object with individual permission functions
- ✅ Updated all permission logic to use `verified` boolean
- ✅ Simplified permission checks:
  - `canCreatePost()` - verified users and admins
  - `canCreateDiscussion()` - verified users and admins
  - `canCreateComment()` - verified users and admins
  - `canModerate()` - admins only

### 3. API Routes Updated

- ✅ `/api/admin/users` - Updated to use verified field
- ✅ `/api/auth/verify` - Updated email verification
- ✅ `/api/user/request-verification` - Updated verification requests
- ✅ `/api/user/profile` - Removed status from select statements
- ✅ `/api/admin/stats` - Updated to use verified field and new permissions

### 4. Components Updated

- ✅ `UsersTable.tsx` - Updated to use verified boolean
- ✅ `UserStatusCard.tsx` - Updated status display logic
- ✅ `ProfileForm.tsx` - Already using verified field

### 5. Examples Updated

- ✅ `role-system-usage.ts` - Updated examples to use new permission system

## New User States

With the simplified system:

1. **Unverified User** (`verified: false, isExpert: false`)

   - Can only read content
   - Cannot post, comment, or participate

2. **Verified User** (`verified: true, isExpert: false`)

   - Can create discussions and comments
   - Cannot write articles

3. **Expert User** (`verified: true, isExpert: true`)

   - Can write articles
   - Can create discussions and comments
   - Has full content creation privileges

4. **Admin User** (`role: 'ADMIN'`)
   - Can moderate all content
   - Has all permissions regardless of verified status

## Migration Benefits

- ✅ Simplified 3-state system instead of complex status enum
- ✅ Clearer permission logic
- ✅ Better performance (boolean checks vs enum comparisons)
- ✅ More intuitive user experience
- ✅ Easier to maintain and extend

## Notes

- All existing users will need their `verified` status set appropriately during migration
- The `isExpert` field is used to distinguish between regular verified users and expert users
- Admin role bypasses all verification requirements
