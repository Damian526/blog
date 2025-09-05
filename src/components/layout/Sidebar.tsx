// Sidebar.tsx (Server Component)
import SidebarClient from './CategoriesList';
import { api } from '@/server/api';

// SSG fetch on the server
async function getCategories() {
  return await api.categories.getAll();
}

export default async function Sidebar() {
  const categories = await getCategories();
  // We get our categories at build time (SSG) or at runtime (SSR)

  return <SidebarClient categories={categories} />;
}
