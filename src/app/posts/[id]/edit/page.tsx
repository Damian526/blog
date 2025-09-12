import { getCategories } from '@/lib/queries/categories';
import EditPostClient from '@/components/posts/EditPostClient';

// Server Component - uses SSG for categories (optimal since categories rarely change)
export default async function EditPostPage() {
  // Fetch categories at build time (SSG) for best performance
  const categories = await getCategories();

  return <EditPostClient categories={categories} />;
}
