import HomePageContent from '@/components/pages/HomePageContent';
import { getPublishedPosts } from '@/lib/queries/posts';

export const dynamic = 'force-dynamic';

type RawParams = Record<string, string | string[] | undefined>;

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<RawParams>;
}) {
  const params: RawParams = (await searchParams) ?? {};

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

  let posts = [];
  let error = null;

  try {
    posts = await getPublishedPosts({
      categoryIds: catIds.length ? catIds : undefined,
      subcategoryIds: subIds.length ? subIds : undefined,
    });
  } catch (e) {
    console.error('Query error', e);
    error = 'Failed to load posts. Please try again later.';
  }

  return <HomePageContent posts={posts} error={error} />;
}

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
