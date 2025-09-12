import PostForm from '@/components/posts/PostForm';
import { getCategories } from '@/lib/queries/categories';

export default async function CreatePostPage() {
  // Use consistent SSG query for categories
  const categories = await getCategories();

  return (
    <div>
      <PostForm categories={categories} />
    </div>
  );
}
