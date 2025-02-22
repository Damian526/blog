import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getCategories() {
  const categories = await prisma.category.findMany({
    include: { subcategories: true },
  });

  return categories;
}
