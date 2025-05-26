'use client';

import { useSession } from 'next-auth/react';
import LoginButton from '@/components/auth/LoginButton';
import RegisterButton from '@/components/auth/RegisterButton';
import LogoutButton from '@/components/auth/LogoutButton';
import Link from 'next/link';
import {
  HeaderContainer,
  ButtonContainer,
  PrimaryButton,
  AdminButton,
  AppName,
  UserInfo,
  UserAvatar,
} from '@/styles/components/layout/Header.styles';

export default function Header() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <HeaderContainer>
        <AppName>WebDevSphere</AppName>
        <div>Loading...</div>
      </HeaderContainer>
    );
  }

  const getUserInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <HeaderContainer>
      <Link href="/" passHref legacyBehavior>
        <AppName as="a">WebDevSphere</AppName>
      </Link>
      <ButtonContainer>
        {session ? (
          <>
            <UserInfo>
              <UserAvatar>
                {getUserInitials(session.user.name, session.user.email)}
              </UserAvatar>
              <span>Welcome, {session.user.name || session.user.email}</span>
            </UserInfo>
            {session.user.role === 'ADMIN' && (
              <Link href="/admin" passHref>
                <AdminButton>Admin Panel</AdminButton>
              </Link>
            )}
            <Link href="/dashboard" passHref>
              <PrimaryButton>Dashboard</PrimaryButton>
            </Link>
            <LogoutButton />
          </>
        ) : (
          <>
            <LoginButton />
            <RegisterButton />
          </>
        )}
      </ButtonContainer>
    </HeaderContainer>
  );
}
