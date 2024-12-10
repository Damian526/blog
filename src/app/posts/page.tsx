import prisma from '@/lib/prisma';

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
  });

  return (
    <div>
      <h1>Published Posts</h1>
      {posts.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}