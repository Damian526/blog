'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import styled from 'styled-components';

const Title = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 20px;
  text-align: center;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 400px;
  width: 100%;
  margin: 0 auto; /* center the form inside its parent */
`;

const Input = styled.input`
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    border-color: #0070f3;
    outline: none;
    box-shadow: 0 0 4px rgba(0, 112, 243, 0.5);
  }
`;

const SubmitButton = styled.button`
  padding: 10px;
  font-size: 1rem;
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;

  &:hover {
    background-color: #005bb5;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.9rem;
  text-align: center;
`;

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
      <Form onSubmit={handleSubmit}>
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
        <SubmitButton type="submit">Sign In</SubmitButton>
      </Form>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </>
  );
}
