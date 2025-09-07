// ============================================
// HOOKS BARREL EXPORTS - CLEAN & ORGANIZED
// ============================================

// Core hooks
export * from './useMutation';

// Posts hooks
export * from './usePosts';
export * from './usePost';

// Comments hooks
export * from './useComments';

// User hooks
export * from './useCurrentUser';

// Categories hooks
export * from './useCategories';

// Admin hooks
export * from './useAdmin';

// Legacy compatibility
export { useCurrentUser as useAuth } from './useCurrentUser';
