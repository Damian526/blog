export default async function getCategories() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
    cache: 'force-cache', // ✅ Enables SSG (default behavior)
  });

  if (!res.ok) throw new Error('Failed to fetch categories');

  return res.json();
}
