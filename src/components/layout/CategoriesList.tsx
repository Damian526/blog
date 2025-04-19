// SidebarClient.tsx (Client Component)
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  width: 250px;
  padding: 20px;
  background: #f5f5f5;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 20px;
`;

const CategoryList = styled.ul`
  list-style: none;
  padding: 0;
`;

const CategoryItem = styled.li`
  margin-bottom: 10px;
  font-weight: bold;
`;

const SubcategoryList = styled.ul`
  list-style: none;
  padding-left: 20px;
  margin-top: 5px;
`;

const SubcategoryItem = styled.li`
  margin-bottom: 5px;
  font-size: 0.9rem;
  font-weight: normal;
`;

export default function SidebarClient({ categories }: { categories: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State arrays of selected IDs
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [selectedSubcategoryIds, setSelectedSubcategoryIds] = useState<
    number[]
  >([]);

  // On mount (or URL change), seed state from the query string
  useEffect(() => {
    const cparam = searchParams.get('categoryIds');
    setSelectedCategoryIds(
      cparam
        ? cparam
            .split(',')
            .map((s) => Number(s))
            .filter((n) => !isNaN(n))
        : [],
    );
    const sparam = searchParams.get('subcategoryIds');
    setSelectedSubcategoryIds(
      sparam
        ? sparam
            .split(',')
            .map((s) => Number(s))
            .filter((n) => !isNaN(n))
        : [],
    );
  }, [searchParams]);

  // whenever selections change, rebuild URL
  function updateUrl(newCats: number[], newSubs: number[]) {
    const params = new URLSearchParams();
    if (newCats.length) params.set('categoryIds', newCats.join(','));
    if (newSubs.length) params.set('subcategoryIds', newSubs.join(','));
    router.push(`/?${params.toString()}`);
  }

  // handlers
  function toggleCategory(id: number, checked: boolean) {
    const next = checked
      ? [...selectedCategoryIds, id]
      : selectedCategoryIds.filter((x) => x !== id);
    setSelectedCategoryIds(next);
    updateUrl(next, selectedSubcategoryIds);
  }

  function toggleSubcategory(id: number, checked: boolean) {
    const next = checked
      ? [...selectedSubcategoryIds, id]
      : selectedSubcategoryIds.filter((x) => x !== id);
    setSelectedSubcategoryIds(next);
    updateUrl(selectedCategoryIds, next);
  }

  return (
    <SidebarContainer>
      <Title>Categories</Title>
      <CategoryList>
        {categories.map((cat) => (
          <CategoryItem key={cat.id}>
            <label>
              <input
                type="checkbox"
                checked={selectedCategoryIds.includes(cat.id)}
                onChange={(e) => toggleCategory(cat.id, e.target.checked)}
              />
              {cat.name}
            </label>

            {cat.subcategories?.length > 0 && (
              <SubcategoryList>
                {cat.subcategories.map((sub: any) => (
                  <SubcategoryItem key={sub.id}>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedSubcategoryIds.includes(sub.id)}
                        onChange={(e) =>
                          toggleSubcategory(sub.id, e.target.checked)
                        }
                      />
                      {sub.name}
                    </label>
                  </SubcategoryItem>
                ))}
              </SubcategoryList>
            )}
          </CategoryItem>
        ))}
      </CategoryList>
    </SidebarContainer>
  );
}
