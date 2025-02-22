
import { getCategories } from '@/lib/fetchCategories';
import Link from 'next/link';

export default async function Sidebar() {
  const categories = await getCategories(); // ✅ Fetch at build time (SSG)

  return (
    <div style={{ width: '250px', padding: '20px', background: '#f8f9fa' }}>
      <h2>Categories</h2>
      <ul>
        {categories.map((cat) => (
          <li key={cat.id}>
            <Link href={`/category/${cat.name.toLowerCase()}`}>{cat.name}</Link>
            <ul>
              {cat.subcategories.map((sub) => (
                <li key={sub.id}>
                  <Link
                    href={`/category/${cat.name.toLowerCase()}/${sub.name.toLowerCase()}`}
                  >
                    {sub.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
