import PostList from '@/components/blog/PostList';

export default async function Home() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${API_BASE_URL}/api/posts`, {
    cache: 'no-store', // Ensure fresh data on each request
  });

  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }

  const posts = await res.json();

  return <PostList posts={posts} />;
}
