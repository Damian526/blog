'use client';

import { useState } from 'react';
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
} from '@/styles/components/posts/PostForm.styles'; // Import styles

interface Post {
  id?: string;
  title: string;
  content: string;
}

interface PostFormProps {
  post?: Post; // Optional for editing
  onSuccessRedirect?: string;
}

export default function PostForm({
  post,
  onSuccessRedirect = '/dashboard',
}: PostFormProps) {
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title || !content) {
      setError('Title and Content are required.');
      return;
    }

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      const url = post?.id
        ? `${API_BASE_URL}/api/posts/${post.id}` // PATCH for editing
        : `${API_BASE_URL}/api/posts`; // POST for creating

      const method = post?.id ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
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

  return (
    <Container>
      <TitleHeading>{post ? 'Edit Post' : 'Create New Post'}</TitleHeading>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Form onSubmit={handleSubmit}>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter the post title"
          required
        />

        <Label htmlFor="content">Content</Label>
        <TextArea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter the post content"
          rows={5}
          required
        />

        <Button type="submit">{post ? 'Update Post' : 'Create Post'}</Button>
      </Form>
    </Container>
  );
}
