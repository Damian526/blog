'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import { uploadImage } from '@/lib/supabase';

import {
  Container,
  TitleHeading,
  Form,
  Label,
  Input,
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
  post?: Post;
  onSuccessRedirect?: string;
  categories: Category[];
}

export default function PostForm({
  post,
  onSuccessRedirect = '/dashboard',
  categories,
}: PostFormProps) {
  const editor = useEditor({
    extensions: [StarterKit, ImageExtension.configure({ inline: true })],
    content: post?.content || '',
  });
  const [title, setTitle] = useState(post?.title || '');
  const [error, setError] = useState<string | null>(null);

  // Track selected main categories
  const [selectedMainCategories, setSelectedMainCategories] = useState<
    number[]
  >([]);

  // Track selected subcategories
  const [selectedSubcategories, setSelectedSubcategories] = useState<number[]>(
    [],
  );

  // For subcategory search
  const [searchTerm, setSearchTerm] = useState<string>('');

  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  // 2. Handle main category checkbox changes
  const handleMainCategoryChange = (categoryId: number, checked: boolean) => {
    if (checked) {
      setSelectedMainCategories((prev) => [...prev, categoryId]);
    } else {
      setSelectedMainCategories((prev) =>
        prev.filter((id) => id !== categoryId),
      );
    }
  };

  // 3. Handle subcategory checkbox changes
  const handleSubcategoryChange = (subcategoryId: number, checked: boolean) => {
    if (checked) {
      setSelectedSubcategories((prev) => [...prev, subcategoryId]);
    } else {
      setSelectedSubcategories((prev) =>
        prev.filter((id) => id !== subcategoryId),
      );
    }
  };

  // 4. Filter subcategories based on search term
  const displayedCategories = categories
    ? categories
        .map((cat) => {
          if (!searchTerm.trim()) {
            // Show all subcategories if no search term
            return cat;
          }
          // Filter subcategories by name
          const matchingSubs = cat.subcategories.filter((sub) =>
            sub.name.toLowerCase().includes(searchTerm.toLowerCase()),
          );
          return {
            ...cat,
            subcategories: matchingSubs,
          };
        })
        // If searching, hide categories that have zero matching subcategories
        .filter((cat) => cat.subcategories.length > 0 || !searchTerm.trim())
    : [];

  // 5. Submit the form
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Basic validations
    if (!title || !editor) {
      setError('Title and Content are required.');
      return;
    }
    if (selectedMainCategories.length === 0) {
      setError('Please select at least one main category.');
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

      const method = post?.id ? 'PATCH' : 'POST';
      const html = editor?.getHTML() || '';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content: html,
          mainCategoryIds: selectedMainCategories,
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

  // 6. Error or loading states
  if (!categories) return <div>Loading...</div>;

  // 7. Render the form UI
  return (
    <div style={{ width: '100%', padding: '0 1rem' }}>
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

          {editor && (
            <EditorContent
              editor={editor}
              style={{
                minHeight: 300,
                border: '1px solid #ccc',
                padding: '0.5rem',
              }}
            />
          )}
          <button
            type="button"
            onClick={async () => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.click();
              input.onchange = async () => {
                const file = input.files?.[0];
                if (file && editor) {
                  const url = await uploadImage(file);
                  editor.chain().focus().setImage({ src: url }).run();
                }
              };
            }}
          >
            Insert Image
          </button>
          {/* Main Categories */}
          <Label>Main Categories</Label>
          <p style={{ fontSize: '0.9rem', margin: '0.5rem 0' }}>
            (Choose at least one main category)
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              border: '1px solid #ccc',
              borderRadius: '6px',
              padding: '0.5rem',
            }}
          >
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
          {/* Search Subcategories */}
          <Label htmlFor="search" style={{ marginTop: '1rem' }}>
            Search Subcategories
          </Label>
          <Input
            id="search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type to search subcategories..."
            style={{ width: '100%', boxSizing: 'border-box' }}
          />
          {/* Subcategories */}
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
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSubcategories.includes(subcategory.id)}
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
          {/* Submit */}
          <Button type="submit" style={{ marginTop: '1rem' }}>
            {post ? 'Update Post' : 'Create Post'}
          </Button>
        </Form>
      </Container>
    </div>
  );
}
