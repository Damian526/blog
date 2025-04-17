// SidebarClient.tsx (Client Component)
'use client';

import Link from 'next/link';
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
  return (
    <SidebarContainer>
      <Title>Categories</Title>
      <CategoryList>
        {categories.map((cat) => (
          <CategoryItem key={cat.id}>
            {/* Clicking this will reload home with ?categoryId=cat.id */}
            <Link
              href={`/?categoryId=${cat.id}`}
              style={{ textDecoration: 'none' }}
            >
              {cat.name}
            </Link>
            {cat.subcategories?.length > 0 && (
              <SubcategoryList>
                {cat.subcategories.map((sub: any) => (
                  <SubcategoryItem key={sub.id}>
                    {/* You could also filter directly by subcategory if you like: */}
                    <Link
                      href={`/?categoryId=${sub?.category?.id}`}
                      style={{ textDecoration: 'none' }}
                    >
                      {sub.name}
                    </Link>
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
