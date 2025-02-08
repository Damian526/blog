'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import {
  Title,
  FormContainer,
  Input,
  Button,
  ErrorMessage,
} from '@/styles/components/auth/authFormStyles';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.ok) {
      window.location.href = '/dashboard';
    } else {
      setError('Invalid credentials');
    }
  }

  return (
    <>
      <Title>Sign In</Title>
      <FormContainer onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">Sign In</Button>
      </FormContainer>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </>
  );
}
