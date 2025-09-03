'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { uploadImage } from '@/lib/supabase';

import EditorSection from '@/components/posts/EditorSection';
import CategorySelector from './CategorySelector';
import { PostFormProps } from '@/types/posts';
import {
  Container,
  TitleHeading,
  Form,
  Button,
  ErrorMessage,
} from '@/styles/components/posts/PostForm.styles';

export default function PostForm({
  post,
  onSuccessRedirect = '/dashboard',
  categories,
}: PostFormProps) {
  const [title, setTitle] = useState(post?.title || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMainCategories, setSelectedMainCategories] = useState<
    number[]
  >([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<number[]>(
    [],
  );
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension.configure({ inline: true }),
      Placeholder.configure({ placeholder: 'Click here to start writing…' }),
    ],
    content: post?.content || '',
    immediatelyRender: false, // Fix SSR hydration mismatch
  });

  const handleAddImage = async () => {
    if (!editor) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();
    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        const url = await uploadImage(file);
        editor.chain().focus().setImage({ src: url }).run();
      }
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title || !editor) {
      setError('Title and Content are required.');
      return;
    }
    if (selectedMainCategories.length === 0) {
      setError('Select at least one main category.');
      return;
    }
    if (selectedSubcategories.length === 0) {
      setError('Select at least one subcategory.');
      return;
    }

    try {
      const url = post?.id
        ? `${API_BASE_URL}/api/posts/${post.id}`
        : `${API_BASE_URL}/api/posts`;
      const method = post?.id ? 'PATCH' : 'POST';
      const html = editor.getHTML();

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content: html,
          mainCategoryIds: selectedMainCategories,
          subcategoryIds: selectedSubcategories,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save.');
      }

      router.push(onSuccessRedirect);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred.',
      );
    }
  }; // ← make sure to close handleSubmit here!

  // Now the component’s return lives here, not inside handleSubmit
  return (
    <Container>
      <TitleHeading>{post ? 'Edit Post' : 'Create New Post'}</TitleHeading>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Form onSubmit={handleSubmit}>
        <EditorSection
          title={title}
          setTitle={setTitle}
          editor={editor}
          handleAddImage={handleAddImage}
        />
        <CategorySelector
          categories={categories}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedMainCategories={selectedMainCategories}
          handleMainCategoryChange={(id, checked) =>
            setSelectedMainCategories((prev) =>
              checked ? [...prev, id] : prev.filter((x) => x !== id),
            )
          }
          selectedSubcategories={selectedSubcategories}
          handleSubcategoryChange={(id, checked) =>
            setSelectedSubcategories((prev) =>
              checked ? [...prev, id] : prev.filter((x) => x !== id),
            )
          }
        />
        <Button type="submit">{post ? 'Update Post' : 'Create Post'}</Button>
      </Form>
    </Container>
  );
}
