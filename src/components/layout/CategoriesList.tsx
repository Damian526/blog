// SidebarClient.tsx (Client Component)
'use client';

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
        {categories.map((category) => (
          <CategoryItem key={category.id}>
            {category.name}
            {category.subcategories?.length > 0 && (
              <SubcategoryList>
                {category.subcategories.map((subcat: any) => (
                  <SubcategoryItem key={subcat.id}>
                    {subcat.name}
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
