'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import LoginForm from '@/components/auth/LoginForm';
import { PrimaryAuthButton } from '@/styles/components/auth/AuthButton.styles';

interface LoginButtonProps {
  onClick?: () => void;
}

export default function LoginButton({ onClick }: LoginButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    setIsModalOpen(true);
    onClick?.();
  };

  return (
    <>
      <PrimaryAuthButton onClick={handleClick}>Login</PrimaryAuthButton>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <LoginForm />
      </Modal>
    </>
  );
}
