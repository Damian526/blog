import { apiClient } from './client';
import { z } from 'zod';

// Zod schemas for categories
const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
});

const SubcategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  categoryId: z.number(),
});

const CategoryWithSubcategoriesSchema = CategorySchema.extend({
  subcategories: z.array(SubcategorySchema),
});

export async function getCategories() {
  // ✅ NO server-side caching - let SWR handle everything!
  return apiClient.get(
    '/api/categories',
    { cache: 'no-store' },
    z.array(CategoryWithSubcategoriesSchema)
  );
}