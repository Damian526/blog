'use client';

import { useState } from 'react';
import styled from 'styled-components';
import Modal from '@/components/ui/Modal';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Input = styled.input`
  padding: 12px;
  margin-bottom: 15px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
`;

const Button = styled.button`
  padding: 12px 20px;
  background-color: #0070f3;
  color: white;
  font-size: 1rem;
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
  margin-top: 10px;
  font-size: 0.9rem;
`;

interface RegisterFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegisterForm({ isOpen, onClose }: RegisterFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    console.log(process.env.NEXT_PUBLIC_API_URL)
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
      onClose();
      window.location.href = '/dashboard';
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <FormContainer>
        <h2>Register</h2>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
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
        </form>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </FormContainer>
    </Modal>
  );
}
