// SidebarClient.tsx (Client Component)
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  padding: var(--space-xl);
  background: var(--background);
  height: 100%;
`;

const Title = styled.h2`
  font-size: var(--font-xl);
  font-weight: 600;
  margin-bottom: var(--space-xl);
  color: var(--text-primary);
  padding-bottom: var(--space-md);
  border-bottom: 2px solid var(--border-light);
`;

const CategoryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const CategoryItem = styled.li`
  margin-bottom: var(--space-lg);
`;

const CategoryLabel = styled.label`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-weight: 600;
  color: var(--text-primary);
  cursor: pointer;
  padding: var(--space-sm);
  border-radius: var(--radius-md);
  transition: all 0.2s ease;

  &:hover {
    background: var(--background-tertiary);
  }
`;

const CategoryCheckbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: var(--primary-color);
  cursor: pointer;
`;

const SubcategoryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: var(--space-md) 0 0 var(--space-xl);
  border-left: 2px solid var(--border-light);
  padding-left: var(--space-md);
`;

const SubcategoryItem = styled.li`
  margin-bottom: var(--space-sm);
`;

const SubcategoryLabel = styled.label`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--font-small);
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;

  &:hover {
    background: var(--background-tertiary);
    color: var(--text-primary);
  }
`;

const SubcategoryCheckbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: var(--primary-color);
  cursor: pointer;
`;

const CategoryIcon = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--primary-color);
  margin-right: var(--space-xs);
`;

const SubcategoryIcon = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-color);
  margin-right: var(--space-xs);
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
