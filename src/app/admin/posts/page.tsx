import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import PublishButton from '@/components/admin/PublishButton';

const prisma = new PrismaClient();

export default async function AdminPostsPage() {
  // 1️⃣ Ensure only admins can access
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  // 2️⃣ Fetch all posts
  const posts = await prisma.post.findMany({
    include: { author: true }, // get author data if you need it
  });

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Manage Posts (Admin)</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id} style={{ marginBottom: '1rem' }}>
            <strong>{post.title}</strong> by {post.author.name} <br />
            {post.published ? (
              <em>Published</em>
            ) : (
              <PublishButton postId={post.id} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
