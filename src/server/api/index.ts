export { apiClient, ApiError, CACHE_TAGS, CACHE_TIMES } from './client';

export * from './types';

// Export all functions from each module
export * from './posts';
export * from './comments';
export * from './users';
export * from './categories';
export * from './admin';
export * from './auth';

// Import functions for the convenience api object
import * as postsApi from './posts';
import * as commentsApi from './comments';
import * as usersApi from './users';
import * as categoriesApi from './categories';
import * as adminApi from './admin';
import * as authApi from './auth';

// Most commonly used functions for quick access
export const api = {
  // Posts
  posts: {
    getAll: postsApi.getPosts,
    getById: postsApi.getPost,
    getPublished: postsApi.getPublishedPosts,
    getByAuthor: postsApi.getPostsByAuthor,
    search: postsApi.searchPosts,
    create: postsApi.createPost,
    update: postsApi.updatePost,
    delete: postsApi.deletePost,
    togglePublished: postsApi.togglePublished,
    getStats: postsApi.getPostStats,
  },
  
  comments: {
    getByPost: commentsApi.getPostComments,
    getById: commentsApi.getComment,
    getByUser: commentsApi.getUserComments,
    getReplies: commentsApi.getCommentReplies,
    getThread: commentsApi.getCommentThread,
    create: commentsApi.createComment,
    reply: commentsApi.replyToComment,
    update: commentsApi.updateComment,
    delete: commentsApi.deleteComment,
    getStats: commentsApi.getCommentStats,
  },
  
  users: {
    getCurrent: usersApi.getCurrentUser,
    getCurrentProfile: usersApi.getCurrentUserProfile,
    updateCurrentProfile: usersApi.updateCurrentUserProfile,
    getById: usersApi.getUser,
    getProfile: usersApi.getUserProfile,
    getAll: usersApi.getUsers,
    search: usersApi.searchUsers,
    update: usersApi.updateUser,
    updateRole: usersApi.updateUserRole,
    delete: usersApi.deleteUser,
    getStats: usersApi.getUserStats,
  },
  
  // Categories
  categories: {
    getAll: categoriesApi.getCategories,
    getById: categoriesApi.getCategory,
    getSubcategories: categoriesApi.getSubcategories,
    getCategorySubcategories: categoriesApi.getCategorySubcategories,
    create: categoriesApi.createCategory,
    createSubcategory: categoriesApi.createSubcategory,
    update: categoriesApi.updateCategory,
    updateSubcategory: categoriesApi.updateSubcategory,
    delete: categoriesApi.deleteCategory,
    deleteSubcategory: categoriesApi.deleteSubcategory,
    getStats: categoriesApi.getCategoryStats,
  },

  // Admin
  admin: {
    getStats: adminApi.getAdminStats,
    getUsers: adminApi.getAdminUsers,
    getPosts: adminApi.getAdminPosts,
    approveUser: adminApi.approveUser,
    rejectUser: adminApi.rejectUser,
    deleteUser: adminApi.adminDeleteUser,
    updateUserRole: adminApi.adminUpdateUserRole,
    publishPost: adminApi.publishPost,
    rejectPost: adminApi.rejectPost,
  },

  // Auth
  auth: {
    register: authApi.register,
    requestVerification: authApi.requestVerification,
  },
};
