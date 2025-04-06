'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import {
  Container,
  TitleHeading,
  Form,
  Label,
  Input,
  TextArea,
  Button,
  ErrorMessage,
} from '@/styles/components/posts/PostForm.styles';

interface Category {
  id: number;
  name: string;
  subcategories: Subcategory[];
}

interface Subcategory {
  id: number;
  name: string;
}

interface Post {
  id?: string;
  title: string;
  content: string;
}

interface PostFormProps {
  post?: Post; // Optional for editing
  onSuccessRedirect?: string;
}

// SWR fetcher function (defined in your SWRProvider)
const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }
  return response.json();
};

export default function PostForm({
  post,
  onSuccessRedirect = '/dashboard',
}: PostFormProps) {
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [error, setError] = useState<string | null>(null);
  const [selectedSubcategories, setSelectedSubcategories] = useState<number[]>(
    [],
  );
  const [searchTerm, setSearchTerm] = useState<string>('');
  const router = useRouter();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  // Fetch categories using SWR
  const { data: categories, error: categoriesError } = useSWR<Category[]>(
    `${API_BASE_URL}/api/categories`,
    fetcher,
  );

  // Handle checkbox changes
  const handleSubcategoryChange = (subcategoryId: number, checked: boolean) => {
    if (checked) {
      setSelectedSubcategories((prev) => [...prev, subcategoryId]);
    } else {
      setSelectedSubcategories((prev) =>
        prev.filter((id) => id !== subcategoryId),
      );
    }
  };

  // Filter subcategories based on search term (only subcategory names)
  const displayedCategories = categories
    ? categories
        .map((category) => {
          if (!searchTerm.trim()) {
            return category;
          }
          const matchingSubs = category.subcategories.filter((subcat) =>
            subcat.name.toLowerCase().includes(searchTerm.toLowerCase()),
          );
          return {
            ...category,
            subcategories: matchingSubs,
          };
        })
        .filter(
          (category) => category.subcategories.length > 0 || !searchTerm.trim(),
        )
    : [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title || !content) {
      setError('Title and Content are required.');
      return;
    }

    if (selectedSubcategories.length === 0) {
      setError('Please select at least one subcategory.');
      return;
    }

    try {
      const url = post?.id
        ? `${API_BASE_URL}/api/posts/${post.id}` // PATCH for editing
        : `${API_BASE_URL}/api/posts`; // POST for creating

      const response = await fetch(url, {
        method: post?.id ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          subcategoryIds: selectedSubcategories,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save post.');
      }

      router.push(onSuccessRedirect);
    } catch (err) {
      setError((err as Error).message || 'Something went wrong.');
    }
  }

  if (categoriesError) return <div>Error loading categories.</div>;
  if (!categories) return <div>Loading categories...</div>;

  return (
    // Outer container takes the full width and leaves a small horizontal padding
    <div style={{ width: '100%', padding: '0 1rem' }}>
      {/* Container can now use 100% of the available space */}
      <Container style={{ width: '100%' }}>
        <TitleHeading>{post ? 'Edit Post' : 'Create New Post'}</TitleHeading>
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Form onSubmit={handleSubmit} style={{ width: '100%' }}>
          {/* Title */}
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter the post title"
            required
            style={{ width: '100%', boxSizing: 'border-box' }}
          />

          {/* Content */}
          <Label htmlFor="content">Content</Label>
          <TextArea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter the post content"
            rows={5}
            required
            style={{
              width: '100%',
              resize: 'vertical',
              boxSizing: 'border-box',
            }}
          />

          {/* Search */}
          <Label htmlFor="search">Search Subcategories</Label>
          <Input
            id="search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type to search subcategories..."
            style={{ width: '100%', boxSizing: 'border-box' }}
          />

          {/* Categories & Subcategories */}
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
                <h3 style={{ margin: '0 0 0.5rem' }}>{category.name}</h3>
                <div
                  style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}
                >
                  {category.subcategories.map((subcategory) => (
                    <label
                      key={subcategory.id}
                      htmlFor={`subcategory-${subcategory.id}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                      }}
                    >
                      <input
                        type="checkbox"
                        id={`subcategory-${subcategory.id}`}
                        value={subcategory.id}
                        onChange={(e) =>
                          handleSubcategoryChange(
                            subcategory.id,
                            e.target.checked,
                          )
                        }
                      />
                      {subcategory.name}
                    </label>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p>No subcategories match your search.</p>
          )}

          {/* Submit Button */}
          <Button type="submit" style={{ marginTop: '1rem' }}>
            {post ? 'Update Post' : 'Create Post'}
          </Button>
        </Form>
      </Container>
    </div>
  );
}
