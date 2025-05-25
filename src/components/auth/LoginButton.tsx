'use client';

import { useState } from 'react';
import styled from 'styled-components';
import Modal from '@/components/ui/Modal';
import LoginForm from '@/components/auth/LoginForm';

const LoginButtonStyled = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-sm) var(--space-lg);
  font-size: var(--font-medium);
  font-weight: 500;
  background: var(--primary-color);
  color: var(--background);
  border: 1px solid var(--primary-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 40px;

  &:hover {
    background: var(--primary-hover);
    border-color: var(--primary-hover);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }
`;

export default function LoginButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <LoginButtonStyled onClick={() => setIsModalOpen(true)}>
        Login
      </LoginButtonStyled>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <LoginForm />
      </Modal>
    </>
  );
}
