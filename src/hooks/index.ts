// ============================================
// HOOKS INDEX - CENTRALIZED EXPORTS
// ============================================

// Current User
export { useCurrentUser } from './useCurrentUser';

// Posts
export { usePost } from './usePost';
export { usePosts, usePublishedPosts, usePostsByAuthor, usePostsSearch } from './usePosts';

// Comments
export { useComments, useComment, useUserComments } from './useComments';

// Users
export { useUser, useUserProfile, useUsersSearch, useUserStats } from './useUsers';

// Categories
export { useCategories } from './useCategories';

// Auth hook (convenience re-export)
export { useCurrentUser as useAuth } from './useCurrentUser';
