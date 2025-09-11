export { apiClient, ApiError } from './client';

export * from './types';

// Export only the remaining API modules
export * from './posts';
export * from './categories';
export * from './comments';

// Import functions for the convenience api object
import * as postsApi from './posts';
import * as categoriesApi from './categories';
import * as commentsApi from './comments';

// Simplified API object - only for SWR client-side caching
export const api = {
  // Posts - for SWR client-side caching only
  posts: {
    getAll: postsApi.getPosts,
    getById: postsApi.getPost,
    getPublished: postsApi.getPublishedPosts,
    getByAuthor: postsApi.getPostsByAuthor,
    search: postsApi.searchPosts,
    getStats: postsApi.getPostStats,
    // Note: create, update, delete moved to server actions in /lib/actions/posts.ts
  },
  
  // Categories - for SWR client-side caching only
  categories: {
    getAll: categoriesApi.getCategories,
  },

  // Comments - for client-side interaction (CSR)
  comments: {
    getByPost: commentsApi.getCommentsByPost,
    create: commentsApi.createComment,
    update: commentsApi.updateComment,
    delete: commentsApi.deleteComment,
    getReplies: commentsApi.getCommentReplies,
  },
};