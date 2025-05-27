import styled from 'styled-components';

export const SidebarContainer = styled.div`
  padding: var(--space-responsive-lg);
  background: var(--background);
  height: 100%;

  @media (max-width: 768px) {
    padding: var(--space-md);
  }
`;

export const Title = styled.h2`
  font-size: var(--font-xl);
  font-weight: 600;
  margin-bottom: var(--space-xl);
  color: var(--text-primary);
  padding-bottom: var(--space-md);
  border-bottom: 2px solid var(--border-light);

  @media (max-width: 768px) {
    font-size: var(--font-large);
    margin-bottom: var(--space-lg);
    padding-bottom: var(--space-sm);
  }
`;

export const CategoryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const CategoryItem = styled.li`
  margin-bottom: var(--space-lg);

  @media (max-width: 768px) {
    margin-bottom: var(--space-md);
  }
`;

export const CategoryLabel = styled.label`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-weight: 600;
  color: var(--text-primary);
  cursor: pointer;
  padding: var(--space-sm);
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
  min-height: 44px; /* Touch-friendly target */

  &:hover {
    background: var(--background-tertiary);
  }

  @media (max-width: 768px) {
    padding: var(--space-md);
    font-size: var(--font-medium);
    gap: var(--space-md);
  }
`;

export const CategoryCheckbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: var(--primary-color);
  cursor: pointer;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
  }
`;

export const SubcategoryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: var(--space-md) 0 0 var(--space-xl);
  border-left: 2px solid var(--border-light);
  padding-left: var(--space-md);

  @media (max-width: 768px) {
    margin: var(--space-sm) 0 0 var(--space-lg);
    padding-left: var(--space-sm);
  }
`;

export const SubcategoryItem = styled.li`
  margin-bottom: var(--space-sm);

  @media (max-width: 768px) {
    margin-bottom: var(--space-xs);
  }
`;

export const SubcategoryLabel = styled.label`
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
  min-height: 40px; /* Touch-friendly target */

  &:hover {
    background: var(--background-tertiary);
    color: var(--text-primary);
  }

  @media (max-width: 768px) {
    padding: var(--space-sm);
    font-size: var(--font-medium);
    gap: var(--space-md);
    min-height: 44px;
  }
`;

export const SubcategoryCheckbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: var(--primary-color);
  cursor: pointer;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 18px;
    height: 18px;
  }
`;

export const CategoryIcon = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--primary-color);
  margin-right: var(--space-xs);
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 10px;
    height: 10px;
  }
`;

export const SubcategoryIcon = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-color);
  margin-right: var(--space-xs);
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 8px;
    height: 8px;
  }
`;
