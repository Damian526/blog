// Sidebar.tsx (Server Component)
import SidebarClient from './CategoriesList';
import { getCategories } from '@/lib/queries/categories';

// SSG fetch on the server - categories rarely change, perfect for SSG
async function getCategoriesSSG() {
  return await getCategories();
}

export default async function Sidebar() {
  const categories = await getCategoriesSSG();
  // Categories fetched at build time (SSG) for optimal performance

  return <SidebarClient categories={categories} />;
}
