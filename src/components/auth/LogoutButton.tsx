'use client';

import { signOut } from 'next-auth/react';
import { DangerAuthButton } from '@/styles/components/auth/AuthButton.styles';

interface LogoutButtonProps {
  onClick?: () => void;
}

export default function LogoutButton({ onClick }: LogoutButtonProps) {
  const handleClick = () => {
    onClick?.();
    signOut({ callbackUrl: '/' });
  };

  return <DangerAuthButton onClick={handleClick}>Logout</DangerAuthButton>;
}
