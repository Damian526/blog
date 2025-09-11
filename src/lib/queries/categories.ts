import prisma from '@/lib/prisma';

/**
 * SSR Query: Get all categories with subcategories
 * Used for server-side rendering when categories are needed for forms/filters
 */
export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        subcategories: {
          orderBy: {
            name: 'asc',
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return categories.map(category => ({
      id: Number(category.id),
      name: category.name,
      subcategories: category.subcategories.map(subcat => ({
        id: Number(subcat.id),
        name: subcat.name,
        categoryId: Number(subcat.categoryId),
      })),
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * SSR Query: Get subcategories for a specific category
 * Used for server-side rendering when filtering by category
 */
export async function getSubcategoriesByCategory(categoryId: number) {
  try {
    const subcategories = await prisma.subcategory.findMany({
      where: { categoryId },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return subcategories.map(subcat => ({
      id: Number(subcat.id),
      name: subcat.name,
      categoryId: Number(subcat.categoryId),
      category: {
        id: Number(subcat.category.id),
        name: subcat.category.name,
      },
    }));
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return [];
  }
}
