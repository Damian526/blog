// SidebarClient.tsx (Client Component)
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  SidebarContainer,
  Title,
  CategoryList,
  CategoryItem,
  CategoryLabel,
  CategoryCheckbox,
  SubcategoryList,
  SubcategoryItem,
  SubcategoryLabel,
  SubcategoryCheckbox,
  CategoryIcon,
  SubcategoryIcon,
} from '@/styles/components/layout/Sidebar.styles';

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
            <CategoryLabel>
              <CategoryCheckbox
                type="checkbox"
                checked={selectedCategoryIds.includes(cat.id)}
                onChange={(e) => toggleCategory(cat.id, e.target.checked)}
              />
              <CategoryIcon />
              {cat.name}
            </CategoryLabel>

            {cat.subcategories?.length > 0 && (
              <SubcategoryList>
                {cat.subcategories.map((sub: any) => (
                  <SubcategoryItem key={sub.id}>
                    <SubcategoryLabel>
                      <SubcategoryCheckbox
                        type="checkbox"
                        checked={selectedSubcategoryIds.includes(sub.id)}
                        onChange={(e) =>
                          toggleSubcategory(sub.id, e.target.checked)
                        }
                      />
                      <SubcategoryIcon />
                      {sub.name}
                    </SubcategoryLabel>
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
