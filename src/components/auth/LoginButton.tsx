'use client';

import { useState } from 'react';
import styled from 'styled-components';
import Modal from '@/components/ui/Modal';
import LoginForm from '@/components/auth/LoginForm';

const LoginButtonStyled = styled.button`
  padding: 10px 20px;
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

export default function LoginButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <LoginButtonStyled onClick={() => setIsModalOpen(true)}>
        Login
      </LoginButtonStyled>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <LoginForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
}
