'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Modal from '@/components/ui/Modal';
import LoginForm from '@/components/auth/LoginForm';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
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

const Error = styled.p`
  color: red;
  font-size: 0.9rem;
`;

export default function NewPostPage() {
  const { data: session, status } = useSession();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();

  // Show the login modal if unauthenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      setShowLoginModal(true);
    }
  }, [status]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title || !content) {
      setError('Title and Content are required.');
      return;
    }

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) {
        throw new Error('Failed to create post.');
      }

      // Redirect to dashboard after successful creation
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    }
  }

  if (status === 'loading') {
    return <p>Loading session...</p>;
  }

  if (!session) {
    return (
      <>
        <p style={{ textAlign: 'center', marginTop: '40px' }}>
          Please login to create a post.
        </p>
        <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)}>
          <LoginForm onClose={() => setShowLoginModal(false)} />
        </Modal>
      </>
    );
  }

  return (
    <Container>
      <Title>Create New Post</Title>
      {error && <Error>{error}</Error>}
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

        <Button type="submit">Create Post</Button>
      </Form>
    </Container>
  );
}
