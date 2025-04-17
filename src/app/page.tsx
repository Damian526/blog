// app/page.tsx
import PostList from '@/components/posts/PostList';

export const dynamic = 'force-dynamic'; // opt into truly dynamic SSR

export default async function Home(props: {
  // searchParams may be a Promise in Next.js 15+
  searchParams: Record<string, string> | Promise<Record<string, string>>;
}) {
  // unwrap the promise
  const searchParams = await props.searchParams;

  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`);
  if (searchParams.categoryId) {
    url.searchParams.set('categoryId', searchParams.categoryId);
  }
  if (searchParams.subcategoryId) {
    url.searchParams.set('subcategoryId', searchParams.subcategoryId);
  }

  let posts = [];
  try {
    const res = await fetch(url.toString(), { next: { revalidate: 60 } });
    if (res.ok) {
      posts = await res.json();
    } else {
      console.error('Fetch posts failed', res.status);
    }
  } catch (e) {
    console.error('Fetch posts error', e);
  }

  return <PostList posts={posts} />;
}
