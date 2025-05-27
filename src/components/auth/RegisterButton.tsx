'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import RegisterForm from '@/components/auth/RegisterForm';
import { SecondaryAuthButton } from '@/styles/components/auth/AuthButton.styles';

interface RegisterButtonProps {
  onClick?: () => void;
}

export default function RegisterButton({ onClick }: RegisterButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    setIsModalOpen(true);
    onClick?.();
  };

  return (
    <>
      <SecondaryAuthButton onClick={handleClick}>Register</SecondaryAuthButton>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <RegisterForm />
      </Modal>
    </>
  );
}
