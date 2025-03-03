// Sidebar.tsx (Server Component)
import SidebarClient from './CategoriesList';

// SSG fetch on the server
async function getCategories() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${API_BASE_URL}/api/categories`, {
    cache: 'force-cache', 
  });

  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export default async function Sidebar() {
  const categories = await getCategories();
  // We get our categories at build time (SSG) or at runtime (SSR)

  // Pass data to a Client Component
  return <SidebarClient categories={categories} />;
}
