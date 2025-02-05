import PostList from '@/components/posts/PostList';

export default async function Home() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${API_BASE_URL}/api/posts`, {
    next: { revalidate: 60 }, // Enable ISR with revalidation every minute
  });

  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }

  const posts = await res.json();

  return <PostList posts={posts} />;
}
