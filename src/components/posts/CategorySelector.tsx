'use client';
import React from 'react';
import { Label, Input } from '@/styles/components/posts/PostForm.styles';
import { Category } from '@/types/posts';

type CategorySelectorProps = {
  categories: Category[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedMainCategories: number[];
  handleMainCategoryChange: (id: number, checked: boolean) => void;
  selectedSubcategories: number[];
  handleSubcategoryChange: (id: number, checked: boolean) => void;
};

export default function CategorySelector({
  categories,
  searchTerm,
  setSearchTerm,
  selectedMainCategories,
  handleMainCategoryChange,
  selectedSubcategories,
  handleSubcategoryChange,
}: CategorySelectorProps) {
  const displayedCategories = categories
    .map((cat) => {
      if (!searchTerm.trim()) return cat;
      const matchingSubs = cat.subcategories.filter((sub) =>
        sub.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      return { ...cat, subcategories: matchingSubs };
    })
    .filter((cat) => cat.subcategories.length > 0 || !searchTerm.trim());

  return (
    <>
      <Label>Main Categories</Label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
        {categories.map((cat) => (
          <label
            key={cat.id}
            style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          >
            <input
              type="checkbox"
              checked={selectedMainCategories.includes(cat.id)}
              onChange={(e) =>
                handleMainCategoryChange(cat.id, e.target.checked)
              }
            />
            {cat.name}
          </label>
        ))}
      </div>

      <Label htmlFor="search" style={{ marginTop: '1rem' }}>
        Search Subcategories
      </Label>
      <Input
        id="search"
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Type to search subcategories..."
      />

      {displayedCategories.length > 0 ? (
        displayedCategories.map((category) => (
          <div
            key={category.id}
            style={{
              margin: '1rem 0',
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '6px',
            }}
          >
            <h3 style={{ margin: 0 }}>{category.name}</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {category.subcategories.map((sub) => (
                <label
                  key={sub.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedSubcategories.includes(sub.id)}
                    onChange={(e) =>
                      handleSubcategoryChange(sub.id, e.target.checked)
                    }
                  />
                  {sub.name}
                </label>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>No subcategories match your search.</p>
      )}
    </>
  );
}
