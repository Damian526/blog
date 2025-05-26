import { useState } from 'react';
import RegisterForm from '@/components/auth/RegisterForm';
import { SecondaryAuthButton } from '@/styles/components/auth/AuthButton.styles';

export default function RegisterButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <SecondaryAuthButton onClick={() => setIsModalOpen(true)}>
        Register
      </SecondaryAuthButton>
      <RegisterForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
