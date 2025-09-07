import { apiClient, CACHE_TAGS, CACHE_TIMES } from './client';
import { Category, CategorySchema, Subcategory, SubcategorySchema } from './types';
import { z } from 'zod';

const CategoryWithSubcategoriesSchema = CategorySchema.extend({
  subcategories: z.array(SubcategorySchema),
});

/**
 * Get all categories with subcategories
 */
export async function getCategories() {
  return apiClient.get(
    '/api/categories',
    {
      tags: [CACHE_TAGS.CATEGORIES],
      revalidate: CACHE_TIMES.VERY_LONG, // Categories don't change often
    },
    z.array(CategoryWithSubcategoriesSchema)
  );
}

/**
 * Get a single category with subcategories
 */
export async function getCategory(id: number) {
  return apiClient.get(
    `/api/categories/${id}`,
    {
      tags: [CACHE_TAGS.CATEGORIES],
      revalidate: CACHE_TIMES.VERY_LONG,
    },
    CategoryWithSubcategoriesSchema
  );
}

/**
 * Get all subcategories
 */
export async function getSubcategories() {
  return apiClient.get(
    '/api/subcategories',
    {
      tags: [CACHE_TAGS.CATEGORIES],
      revalidate: CACHE_TIMES.VERY_LONG,
      },
      z.array(SubcategorySchema.extend({
        category: CategorySchema,
      }))
    );
  }

/**
 * Get subcategories for a specific category
 */
export async function getCategorySubcategories(categoryId: number) {
  return apiClient.get(
    `/api/categories/${categoryId}/subcategories`,
    {
      tags: [CACHE_TAGS.CATEGORIES],
      revalidate: CACHE_TIMES.VERY_LONG,
    },
    z.array(SubcategorySchema)
  );
}

/**
 * Create a new category (admin only)
 */
export async function createCategory(name: string) {
  const CreateCategorySchema = z.object({
    name: z.string().min(1, 'Category name is required'),
  });
  
  const validatedData = CreateCategorySchema.parse({ name });
  
  return apiClient.post(
    '/api/categories',
    validatedData,
    {
      tags: [CACHE_TAGS.CATEGORIES],
    },
    CategorySchema
  );
}

/**
 * Create a new subcategory (admin only)
 */
export async function createSubcategory(name: string, categoryId: number) {
  const CreateSubcategorySchema = z.object({
    name: z.string().min(1, 'Subcategory name is required'),
    categoryId: z.number(),
  });
  
  const validatedData = CreateSubcategorySchema.parse({ name, categoryId });
  
  return apiClient.post(
    '/api/subcategories',
    validatedData,
    {
      tags: [CACHE_TAGS.CATEGORIES],
    },
    SubcategorySchema
  );
}

/**
 * Update a category (admin only)
 */
export async function updateCategory(id: number, name: string) {
  const UpdateCategorySchema = z.object({
    name: z.string().min(1, 'Category name is required'),
  });
  
  const validatedData = UpdateCategorySchema.parse({ name });
  
  return apiClient.patch(
    `/api/categories/${id}`,
    validatedData,
    {
      tags: [CACHE_TAGS.CATEGORIES],
    },
    CategorySchema
  );
}

/**
 * Update a subcategory (admin only)
 */
export async function updateSubcategory(id: number, data: { name?: string; categoryId?: number }) {
  const UpdateSubcategorySchema = z.object({
    name: z.string().min(1).optional(),
    categoryId: z.number().optional(),
  });
  
  const validatedData = UpdateSubcategorySchema.parse(data);
  
  return apiClient.patch(
    `/api/subcategories/${id}`,
    validatedData,
    {
      tags: [CACHE_TAGS.CATEGORIES],
    },
    SubcategorySchema
  );
}

/**
 * Delete a category (admin only)
 */
export async function deleteCategory(id: number) {
  return apiClient.delete(
    `/api/categories/${id}`,
    {
      tags: [CACHE_TAGS.CATEGORIES],
    }
  );
}

/**
 * Delete a subcategory (admin only)
 */
export async function deleteSubcategory(id: number) {
  return apiClient.delete(
    `/api/subcategories/${id}`,
    {
      tags: [CACHE_TAGS.CATEGORIES],
    }
  );
}

/**
 * Get category statistics
 */
export async function getCategoryStats(id: number) {
  return apiClient.get(
    `/api/categories/${id}/stats`,
    {
      tags: [CACHE_TAGS.CATEGORIES],
      revalidate: CACHE_TIMES.MEDIUM,
    },
    z.object({
      totalPosts: z.number(),
      publishedPosts: z.number(),
      subcategoriesCount: z.number(),
    })
  );
}

// ============================================
// CACHE INVALIDATION HELPERS
// ============================================

/**
 * Revalidate categories cache
 */
export async function revalidateCategories() {
  const { revalidateTag } = await import('next/cache');
  revalidateTag(CACHE_TAGS.CATEGORIES);
}
