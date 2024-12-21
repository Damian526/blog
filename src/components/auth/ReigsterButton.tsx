import { useState } from 'react';
import styled from 'styled-components';
import RegisterForm from '@/components/auth/RegisterForm';

const Button = styled.button`
  padding: 12px 20px;
  background-color: #0070f3;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #005bb5;
  }
`;

export default function RegisterButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>Register</Button>
      <RegisterForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
