// app/page.tsx
import PostList from '@/components/posts/PostList';

// Force dynamic rendering for real-time data
export const dynamic = 'force-dynamic';

type RawParams = Record<string, string | string[] | undefined>;

// Server Component - pre-renders posts on the server
export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<RawParams>;
}) {
  // Always await searchParams
  const params: RawParams = (await searchParams) ?? {};

  // Helper functions
  const csvToNums = (val?: string | string[]) =>
    typeof val === 'string'
      ? val
          .split(',')
          .map(Number)
          .filter((n) => !isNaN(n))
      : Array.isArray(val)
        ? val.flatMap((v) =>
            v
              .split(',')
              .map(Number)
              .filter((n) => !isNaN(n)),
          )
        : [];

  const catIds = csvToNums(params.categoryIds);
  const subIds = csvToNums(params.subcategoryIds);

  // Build fetch URL
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`);
  if (catIds.length) url.searchParams.set('categoryIds', catIds.join(','));
  if (subIds.length) url.searchParams.set('subcategoryIds', subIds.join(','));

  let posts = [];
  let error = null;

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 60 }, // Cache for 60 seconds
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      posts = await res.json();
    } else {
      console.error('Fetch failed', res.status);
      error = `Failed to load posts (${res.status})`;
    }
  } catch (e) {
    console.error('Fetch error', e);
    error = 'Failed to load posts. Please try again later.';
  }

  return (
    <div>
      <header style={{ padding: '2rem 0', textAlign: 'center' }}>
        <h1>WebDevSphere</h1>
        <p>Discover the latest articles about web development</p>
      </header>

      {/* Server-rendered posts with error handling */}
      {error ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
          {error}
        </div>
      ) : (
        <PostList posts={posts} showActions={false} />
      )}
    </div>
  );
}

// Generate metadata for SEO
export const metadata = {
  title: 'WebDevSphere - Web Development Articles',
  description:
    'Discover the latest articles, tutorials, and insights about web development technologies.',
  openGraph: {
    title: 'WebDevSphere - Web Development Articles',
    description:
      'Discover the latest articles, tutorials, and insights about web development technologies.',
  },
};
