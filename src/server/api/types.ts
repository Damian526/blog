import { z } from 'zod';

// ============================================
// SHARED SCHEMAS FOR RUNTIME VALIDATION
// ============================================

export const UserSchema = z.object({
  id: z.number(),
  name: z.string().nullable(),
  email: z.string(),
  image: z.string().nullable(),
  role: z.enum(['ADMIN', 'USER']).optional(),
  emailVerified: z.boolean().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const SubcategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  categoryId: z.number(),
  category: CategorySchema.optional(),
});

export const CommentSchema = z.object({
  id: z.number(),
  content: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  userId: z.number(),
  postId: z.number(),
  parentId: z.number().nullable(),
  author: UserSchema,
  replies: z.array(z.lazy(() => CommentSchema)).optional(),
  _count: z.object({
    replies: z.number(),
  }).optional(),
});

export const PostSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  published: z.boolean(),
  declineReason: z.string().nullable(),
  coverImageUrl: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  authorId: z.number(),
  author: UserSchema,
  subcategories: z.array(SubcategorySchema).optional(),
  comments: z.array(CommentSchema).optional(),
  _count: z.object({
    comments: z.number(),
  }).optional(),
});

// ============================================
// TYPESCRIPT TYPES (INFERRED FROM SCHEMAS)
// ============================================

export type User = z.infer<typeof UserSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Subcategory = z.infer<typeof SubcategorySchema>;
export type Comment = z.infer<typeof CommentSchema>;
export type Post = z.infer<typeof PostSchema>;

// ============================================
// API RESPONSE WRAPPERS
// ============================================

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

// ============================================
// REQUEST/MUTATION SCHEMAS
// ============================================

export const CreatePostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  published: z.boolean().default(false),
  coverImageUrl: z.string().url().optional().or(z.literal('')),
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

// ============================================
// FILTER/QUERY SCHEMAS
// ============================================

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

export type PostFilters = z.infer<typeof PostFiltersSchema>;
export type CreatePost = z.infer<typeof CreatePostSchema>;
export type UpdatePost = z.infer<typeof UpdatePostSchema>;
export type CreateComment = z.infer<typeof CreateCommentSchema>;
export type UpdateComment = z.infer<typeof UpdateCommentSchema>;
