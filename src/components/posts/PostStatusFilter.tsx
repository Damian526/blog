'use client';

import React from 'react';
import styled from 'styled-components';

const FilterContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  padding: 16px;
  background: var(--color-surface);
  border-radius: 12px;
  border: 1px solid var(--color-border);
`;

const FilterButton = styled.button<{ $active?: boolean }>`
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: ${({ $active }) => 
    $active ? 'var(--color-primary)' : 'var(--color-background)'};
  color: ${({ $active }) => 
    $active ? 'var(--color-white)' : 'var(--color-text)'};
  font-weight: ${({ $active }) => $active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $active }) => 
      $active ? 'var(--color-primary-dark)' : 'var(--color-surface)'};
  }

  &:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
`;

const FilterLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-secondary);
  margin-right: 16px;
`;

interface PostStatusFilterProps {
  value: 'all' | 'published' | 'unpublished';
  onChange: (value: 'all' | 'published' | 'unpublished') => void;
  showCounts?: {
    all: number;
    published: number;
    unpublished: number;
  };
}

export default function PostStatusFilter({ 
  value, 
  onChange, 
  showCounts 
}: PostStatusFilterProps) {
  return (
    <FilterContainer>
      <FilterLabel>Filter by status:</FilterLabel>
      
      <FilterButton
        $active={value === 'all'}
        onClick={() => onChange('all')}
      >
        All Posts {showCounts && `(${showCounts.all})`}
      </FilterButton>
      
      <FilterButton
        $active={value === 'published'}
        onClick={() => onChange('published')}
      >
        Published {showCounts && `(${showCounts.published})`}
      </FilterButton>
      
      <FilterButton
        $active={value === 'unpublished'}
        onClick={() => onChange('unpublished')}
      >
        Unpublished {showCounts && `(${showCounts.unpublished})`}
      </FilterButton>
    </FilterContainer>
  );
}
