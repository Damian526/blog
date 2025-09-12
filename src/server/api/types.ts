import { z } from 'zod';

export const UserSchema = z.object({
  id: z.coerce.number(),
  name: z.string(), 
  email: z.string(),
  image: z.string().nullable().optional(), 
  role: z.enum(['ADMIN', 'USER']).default('USER'),
  emailVerified: z.boolean().optional(),
  verified: z.boolean().optional(),
  profilePicture: z.string().nullable().optional(),
  isExpert: z.boolean().optional(),
  verificationReason: z.string().nullable().optional(),
  portfolioUrl: z.string().nullable().optional(),
  approvedBy: z.coerce.number().nullable().optional(),
  approvedAt: z.string().nullable().optional(),
  createdAt: z.string(),
});

export const CategorySchema = z.object({
  id: z.coerce.number(),
  name: z.string(),
});

export const SubcategorySchema = z.object({
  id: z.coerce.number(),
  name: z.string(),
  categoryId: z.coerce.number(),
  category: CategorySchema.optional(),
});

export const CommentSchema = z.object({
  id: z.coerce.number(),
  content: z.string().nullable(),
  createdAt: z.string(), 
  authorId: z.coerce.number(),
  postId: z.coerce.number().nullable(),
  discussionId: z.coerce.number().nullable(),
  parentId: z.coerce.number().nullable(),
  author: z.object({
    id: z.coerce.number(),
    name: z.string().nullable(), 
    email: z.string(),
    image: z.string().nullable().optional(),
    createdAt: z.string(), 
  }).nullable(),
  replies: z.array(z.lazy(() => CommentSchema)).optional(),
  _count: z.object({
    replies: z.coerce.number(),
  }).optional(),
});

export const PostSchema = z.object({
  id: z.coerce.number(),
  title: z.string(),
  content: z.string(),
  published: z.boolean(),
  declineReason: z.string().nullable(),
  createdAt: z.string(), 
  author: z.object({
    id: z.coerce.number().optional(),
    name: z.string().nullable(), 
    email: z.string(),
    image: z.string().nullable().optional(),
    createdAt: z.string().optional(), 
  }).nullable(),
  subcategories: z.array(SubcategorySchema).default([]),
  comments: z.array(CommentSchema).optional(),
  _count: z.object({
    comments: z.coerce.number(),
  }),
});

export const PostSummarySchema = z.object({
  id: z.coerce.number(),
  title: z.string(),
  content: z.string(),
  published: z.boolean(),
  declineReason: z.string().nullable(),
  createdAt: z.string(),
  author: z.object({
    id: z.coerce.number().optional(),
    name: z.string().nullable(),
    email: z.string(),
    image: z.string().nullable().optional(),
    createdAt: z.string().optional(), 
  }).nullable(),
  subcategories: z.array(z.object({
    id: z.coerce.number(),
    name: z.string(),
    categoryId: z.coerce.number(),
    category: z.object({
      id: z.coerce.number(),
      name: z.string(),
    }).optional(),
  })).default([]),
  _count: z.object({
    comments: z.coerce.number(),
  }),
});

// Admin API Types
export const AdminUserSchema = z.object({
  id: z.coerce.number(),
  name: z.string(),
  email: z.string(),
  role: z.enum(['ADMIN', 'USER']),
  verified: z.boolean(),
  isExpert: z.boolean(),
  verificationReason: z.string().nullable(),
  portfolioUrl: z.string().nullable(),
  profilePicture: z.string().nullable(),
  createdAt: z.string(),
  _count: z.object({
    posts: z.number(),
    comments: z.number(),
  }),
});

export const AdminStatsSchema = z.object({
  users: z.object({
    total: z.number(),
    verified: z.number(),
    pending: z.number(),
    experts: z.number(),
    verificationRequests: z.number(),
  }),
  posts: z.object({
    total: z.number(),
    published: z.number(),
    pending: z.number(),
    rejected: z.number(),
  }),
  comments: z.object({
    total: z.number(),
  }),
  overview: z.object({
    totalUsers: z.number(),
    totalPosts: z.number(),
    totalComments: z.number(),
    pendingApprovals: z.number(),
  }),
});

export const AdminPostsResponseSchema = z.object({
  posts: z.array(PostSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

// Schema functions
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    success: z.boolean(),
    error: z.string().optional(),
  });

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    pagination: z.object({
      total: z.number(),
      pages: z.number(),
      page: z.number(),
      limit: z.number(),
    }),
    success: z.boolean(),
    error: z.string().optional(),
  });

// Form schemas
export const CreatePostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  published: z.boolean().default(false),
  subcategoryIds: z.array(z.number()).optional(),
});

export const UpdatePostSchema = CreatePostSchema.partial();

export const CreateCommentSchema = z.object({
  content: z.string().min(1, 'Comment content is required'),
  postId: z.number(),
  parentId: z.number().optional(),
});

export const UpdateCommentSchema = z.object({
  content: z.string().min(1, 'Comment content is required'),
});

export const PostFiltersSchema = z.object({
  published: z.boolean().optional(),
  categoryIds: z.array(z.number()).optional(),
  subcategoryIds: z.array(z.number()).optional(),
  authorId: z.number().optional(),
  search: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.enum(['createdAt', 'updatedAt', 'title']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Type exports
export type User = z.infer<typeof UserSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Subcategory = z.infer<typeof SubcategorySchema>;
export type Comment = z.infer<typeof CommentSchema>;
export type Post = z.infer<typeof PostSchema>;
export type PostSummary = z.infer<typeof PostSummarySchema>;
export type AdminUser = z.infer<typeof AdminUserSchema>;
export type AdminStats = z.infer<typeof AdminStatsSchema>;
export type AdminPostsResponse = z.infer<typeof AdminPostsResponseSchema>;

// Form and request types
export type CreatePost = z.infer<typeof CreatePostSchema>;
export type UpdatePost = z.infer<typeof UpdatePostSchema>;
export type CreateComment = z.infer<typeof CreateCommentSchema>;
export type UpdateComment = z.infer<typeof UpdateCommentSchema>;
export type PostFilters = z.infer<typeof PostFiltersSchema>;
