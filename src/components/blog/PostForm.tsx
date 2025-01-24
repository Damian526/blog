'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const TitleHeading = styled.h1`
  text-align: center;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 10px;
  font-weight: bold;
`;

const Input = styled.input`
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
`;

const Button = styled.button`
  background-color: #0070f3;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #005bb5;
  }
`;

// Renamed styled component from `Error` to `ErrorMessage`
const ErrorMessage = styled.p`
  color: red;
  font-size: 0.9rem;
`;

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

      // Redirect after successful save
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
