'use client';

import { signOut } from 'next-auth/react';
import { DangerAuthButton } from '@/styles/components/auth/AuthButton.styles';

export default function LogoutButton() {
  return (
    <DangerAuthButton onClick={() => signOut({ callbackUrl: '/' })}>
      Logout
    </DangerAuthButton>
  );
}
