// app/page.tsx
import PostList from '@/components/posts/PostList';
import styled from 'styled-components';

// Force dynamic rendering for real-time data
export const dynamic = 'force-dynamic';

const PageHeader = styled.header`
  padding: var(--space-responsive-xl) 0;
  text-align: center;
  background: linear-gradient(
    135deg,
    var(--background) 0%,
    var(--background-tertiary) 100%
  );
  border-bottom: 1px solid var(--border-light);
  margin-bottom: var(--space-responsive-lg);

  h1 {
    font-size: var(--font-xxl);
    font-weight: 700;
    margin-bottom: var(--space-md);
    background: linear-gradient(
      135deg,
      var(--primary-color),
      var(--accent-color)
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;

    @media (max-width: 768px) {
      font-size: var(--font-xl);
      margin-bottom: var(--space-sm);
    }

    @media (max-width: 480px) {
      font-size: var(--font-large);
    }
  }

  p {
    font-size: var(--font-large);
    color: var(--text-secondary);
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;

    @media (max-width: 768px) {
      font-size: var(--font-medium);
      padding: 0 var(--space-md);
    }

    @media (max-width: 480px) {
      font-size: var(--font-small);
    }
  }

  @media (max-width: 768px) {
    padding: var(--space-xl) 0;
    margin-bottom: var(--space-lg);
  }

  @media (max-width: 480px) {
    padding: var(--space-lg) 0;
    margin-bottom: var(--space-md);
  }
`;

const ErrorMessage = styled.div`
  padding: var(--space-responsive-xl);
  text-align: center;
  color: var(--error-color);
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: var(--radius-lg);
  margin: var(--space-responsive-lg) auto;
  max-width: 600px;

  @media (max-width: 768px) {
    margin: var(--space-lg) var(--space-md);
    padding: var(--space-lg);
  }
`;

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
      <PageHeader>
        <h1>WebDevSphere</h1>
        <p>Discover the latest articles about web development</p>
      </PageHeader>

      {/* Server-rendered posts with error handling */}
      {error ? (
        <ErrorMessage>{error}</ErrorMessage>
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
