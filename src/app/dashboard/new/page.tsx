import PostForm from '@/components/posts/PostForm';
import prisma from '@/lib/prisma';

export default async function CreatePostPage() {
  const categories = await prisma.category.findMany({
    include: { subcategories: true },
  });

  return (
    <div>
      <PostForm categories={categories} />
    </div>
  );
}
