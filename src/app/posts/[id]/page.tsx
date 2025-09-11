import { notFound } from 'next/navigation';
import { getPostById } from '@/lib/queries/posts';
import PostDetailPage from '@/components/posts/PostDetailPage';

// Server Component for better SEO and performance
export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const postId = parseInt(resolvedParams.id);

  if (isNaN(postId)) {
    notFound();
  }

  // Fetch post data on the server
  const post = await getPostById(postId);

  if (!post) {
    notFound();
  }

  return <PostDetailPage post={post} postId={postId} />;
}
