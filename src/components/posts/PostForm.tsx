'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { uploadImage } from '@/lib/supabase';
import { api } from '@/server/api';

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
    if (selectedSubcategories.length === 0) {
      setError('Select at least one subcategory.');
      return;
    }

    try {
      const html = editor.getHTML();
      
      const postData = {
        title,
        content: html,
        subcategoryIds: selectedSubcategories, // Only send subcategories as backend expects
      };

      if (post?.id) {
        // Update existing post
        await api.posts.update(post.id, postData);
      } else {
        // Create new post
        await api.posts.create(postData);
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
