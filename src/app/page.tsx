import PostList from '@/components/blog/PostList';

export default async function Home() {
  // Replace this with a real API/database call
  const posts = [
    {
      id: 1,
      title: 'First Blog Post',
      excerpt: 'This is the first post...',
      slug: 'first-blog-post',
    },
    {
      id: 2,
      title: 'Second Blog Post',
      excerpt: 'This is the second post...',
      slug: 'second-blog-post',
    },
  ];

  return <PostList posts={posts} />;
}
