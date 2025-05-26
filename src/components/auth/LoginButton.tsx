'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import LoginForm from '@/components/auth/LoginForm';
import { PrimaryAuthButton } from '@/styles/components/auth/AuthButton.styles';

export default function LoginButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <PrimaryAuthButton onClick={() => setIsModalOpen(true)}>
        Login
      </PrimaryAuthButton>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <LoginForm />
      </Modal>
    </>
  );
}
