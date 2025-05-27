'use client';

import { useState } from 'react';
import {
  Title,
  FormContainer,
  Input,
  Button,
  ErrorMessage,
  SuccessMessage,
} from '@/styles/components/auth/authFormStyles';

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to register.');
      } else {
        setSuccess(
          'Registration successful! Check your email to verify your account.',
        );
      }
    } catch (err) {
      setError('An error occurred while registering.');
    }
  }

  return (
    <>
      <Title>Register</Title>
      <FormContainer onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <Button type="submit">Register</Button>
      </FormContainer>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
    </>
  );
}
