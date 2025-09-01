// ============================================
// MAIN API EXPORTS
// ============================================

// API Client
export { apiClient, ApiError, CACHE_TAGS, CACHE_TIMES } from './client';

// Type Definitions & Schemas
export * from './types';

// API Services
export { PostsApi, revalidatePosts, revalidatePost, revalidateAllPosts } from './posts';
export { CommentsApi, revalidatePostComments, revalidateComment, revalidateAllComments } from './comments';
export { UsersApi, revalidateUser, revalidateAllUsers } from './users';
export { CategoriesApi, revalidateCategories } from './categories';

// Import for internal use
import { PostsApi } from './posts';
import { CommentsApi } from './comments';
import { UsersApi } from './users';
import { CategoriesApi } from './categories';

// ============================================
// CONVENIENCE RE-EXPORTS FOR COMMON OPERATIONS
// ============================================

// Most commonly used functions for quick access
export const api = {
  // Posts
  posts: {
    getAll: PostsApi.getPosts,
    getById: PostsApi.getPost,
    getPublished: PostsApi.getPublishedPosts,
    getByAuthor: PostsApi.getPostsByAuthor,
    search: PostsApi.searchPosts,
    create: PostsApi.createPost,
    update: PostsApi.updatePost,
    delete: PostsApi.deletePost,
    togglePublished: PostsApi.togglePublished,
    getStats: PostsApi.getPostStats,
  },
  
  // Comments
  comments: {
    getByPost: CommentsApi.getPostComments,
    getById: CommentsApi.getComment,
    getByUser: CommentsApi.getUserComments,
    getReplies: CommentsApi.getCommentReplies,
    getThread: CommentsApi.getCommentThread,
    create: CommentsApi.createComment,
    reply: CommentsApi.replyToComment,
    update: CommentsApi.updateComment,
    delete: CommentsApi.deleteComment,
    getStats: CommentsApi.getCommentStats,
  },
  
  // Users
  users: {
    getCurrent: UsersApi.getCurrentUser,
    getById: UsersApi.getUser,
    getProfile: UsersApi.getUserProfile,
    getAll: UsersApi.getUsers,
    search: UsersApi.searchUsers,
    update: UsersApi.updateUser,
    updateRole: UsersApi.updateUserRole,
    delete: UsersApi.deleteUser,
    getStats: UsersApi.getUserStats,
  },
  
  // Categories
  categories: {
    getAll: CategoriesApi.getCategories,
    getById: CategoriesApi.getCategory,
    getSubcategories: CategoriesApi.getSubcategories,
    getCategorySubcategories: CategoriesApi.getCategorySubcategories,
    create: CategoriesApi.createCategory,
    createSubcategory: CategoriesApi.createSubcategory,
    update: CategoriesApi.updateCategory,
    updateSubcategory: CategoriesApi.updateSubcategory,
    delete: CategoriesApi.deleteCategory,
    deleteSubcategory: CategoriesApi.deleteSubcategory,
    getStats: CategoriesApi.getCategoryStats,
  },
};
