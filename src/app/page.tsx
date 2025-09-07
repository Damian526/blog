import HomePageContent from '@/components/pages/HomePageContent';
import { api } from '@/server/api';

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
    posts = await api.posts.getPublished({
      categoryIds: catIds.length ? catIds : undefined,
      subcategoryIds: subIds.length ? subIds : undefined,
      published: true,
    });
  } catch (e) {
    console.error('API error', e);
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
