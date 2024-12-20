'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import styled from 'styled-components';

interface LoginFormProps {
  onClose: () => void;
}

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 20px;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 15px;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;

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

  &:hover {
    background-color: #005bb5;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.9rem;
  text-align: center;
`;

const CloseButton = styled.button`
  margin-top: 10px;
  padding: 10px;
  font-size: 1rem;
  background-color: #ccc;
  color: #333;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #999;
  }
`;

export default function LoginForm({ onClose }: LoginFormProps) {
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
    <FormContainer>
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
      <CloseButton onClick={onClose}>Close</CloseButton>
    </FormContainer>
  );
}
