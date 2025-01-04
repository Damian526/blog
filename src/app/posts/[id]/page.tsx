import PostContent from '@/components/blog/PostContent';

export default async function PostPage({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  params,
}: {
  params: { slug: string };
}) {
  // Replace with API/database fetch
  const post = {
    title: 'Example Blog Post',
    content: '<p>This is the full content of the blog post.</p>',
  };

  return <PostContent post={post} />;
}
