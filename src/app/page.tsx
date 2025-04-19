// app/page.tsx
import PostList from '@/components/posts/PostList';

export const dynamic = 'force-dynamic';
type SearchParams =
  | Record<string, string | string[] | undefined>
  | Promise<Record<string, string | string[] | undefined>>;
export default async function Home({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const params =
    searchParams && typeof (searchParams as any)?.then === 'function'
      ? await searchParams
      : ((searchParams as
          | Record<string, string | string[] | undefined>
          | undefined) ?? {});

  /* ---------- helpers ---------- */
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

  // build fetch URL
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`);
  if (catIds.length) url.searchParams.set('categoryIds', catIds.join(','));
  if (subIds.length) url.searchParams.set('subcategoryIds', subIds.join(','));

  let posts = [];
  try {
    const res = await fetch(url.toString(), { next: { revalidate: 60 } });
    if (res.ok) posts = await res.json();
    else console.error('Fetch failed', res.status);
  } catch (e) {
    console.error('Fetch error', e);
  }

  return <PostList posts={posts} />;
}
