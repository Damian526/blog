import PostContent from '@/components/blog/PostContent';

export default async function SinglePostPage({
  params,
}: {
  params: { id: string };
}) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  // Fetch the single post data
  const res = await fetch(`${API_BASE_URL}/api/posts/${params.id}`, {
    cache: 'no-store', // Fetch fresh data on every request
  });

  if (!res.ok) {
    return (
      <div>
        <h1>Post Not Found</h1>
        <p>The requested post does not exist or has been deleted.</p>
      </div>
    );
  }

  const post = await res.json();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <PostContent post={post} />
    </div>
  );
}
