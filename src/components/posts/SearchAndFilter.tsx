'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styled from 'styled-components';

const FilterContainer = styled.div`
  padding: 1rem;
  background: var(--background);
  border-radius: var(--radius-md);
  margin-bottom: 2rem;
  box-shadow: var(--shadow-sm);
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: 400px;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 1rem;
  margin-bottom: 1rem;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgb(37 99 235 / 0.1);
  }
`;

const FilterRow = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: var(--background);
`;

export default function SearchAndFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Initialize from URL params
    setSearchTerm(searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('category') || '');
  }, [searchParams]);

  const handleSearch = (term: string) => {
    if (!isClient) return;

    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('search', term);
    } else {
      params.delete('search');
    }
    router.push(`/?${params.toString()}`);
  };

  const handleCategoryChange = (category: string) => {
    if (!isClient) return;

    const params = new URLSearchParams(searchParams);
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    router.push(`/?${params.toString()}`);
  };

  // Don't render until client-side to avoid hydration issues
  if (!isClient) {
    return (
      <FilterContainer>
        <div>Loading filters...</div>
      </FilterContainer>
    );
  }

  return (
    <FilterContainer>
      <SearchInput
        type="text"
        placeholder="Search articles..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          // Debounce search
          setTimeout(() => handleSearch(e.target.value), 500);
        }}
      />

      <FilterRow>
        <label>
          Category:
          <FilterSelect
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              handleCategoryChange(e.target.value);
            }}
          >
            <option value="">All Categories</option>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="mobile">Mobile</option>
          </FilterSelect>
        </label>
      </FilterRow>
    </FilterContainer>
  );
}
