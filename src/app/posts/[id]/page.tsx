import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import PostContent from '@/components/posts/PostContent';
import CommentsSection from '@/components/comments/CommentsSection';

const prisma = new PrismaClient();

// This is a Server Component - runs on the server
export default async function PostPage({ params }: { params: { id: string } }) {
  const postId = parseInt(params.id);

  if (isNaN(postId)) {
    notFound();
  }

  // Fetch post data on the server
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: {
        select: { name: true, email: true },
      },
      _count: {
        select: { comments: true },
      },
    },
  });

  if (!post) {
    notFound();
  }

  // This content is pre-rendered on the server
  return (
    <div>
      <PostContent post={post} />
      {/* Comments section can be client-side for interactivity */}
      <CommentsSection postId={postId} />
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { id: string } }) {
  const postId = parseInt(params.id);

  if (isNaN(postId)) {
    return { title: 'Post Not Found' };
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { title: true, content: true },
  });

  if (!post) {
    return { title: 'Post Not Found' };
  }

  // Create excerpt from content (first 160 characters)
  const excerpt = post.content
    ? post.content.replace(/<[^>]*>/g, '').substring(0, 160) + '...'
    : `Read ${post.title} on WebDevSphere`;

  return {
    title: post.title,
    description: excerpt,
    openGraph: {
      title: post.title,
      description: excerpt,
    },
  };
}
