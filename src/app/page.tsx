// app/page.tsx
import PostList from '@/components/posts/PostList';

export const dynamic = 'force-dynamic';

export default async function Home(props: {
  searchParams: Record<string, string> | Promise<Record<string, string>>;
}) {
  const { categoryId, subcategoryId } = await props.searchParams;

  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`);
  const cid = Number(categoryId);
  if (!Number.isNaN(cid)) url.searchParams.set('categoryId', String(cid));
  const scid = Number(subcategoryId);
  if (!Number.isNaN(scid)) url.searchParams.set('subcategoryId', String(scid));

  let posts = [];
  try {
    const res = await fetch(url.toString(), { next: { revalidate: 60 } });
    if (res.ok) posts = await res.json();
    else console.error('Fetch failed', res.status);
  } catch (e) {
    console.error('Fetch error', e);
  }

  return <PostList posts={posts} />;
}
