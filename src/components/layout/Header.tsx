'use client';

import styled from 'styled-components';
import { useSession } from 'next-auth/react';
import LoginButton from '@/components/auth/LoginButton';
import RegisterButton from '@/components/auth/RegisterButton';
import LogoutButton from '@/components/auth/LogoutButton';
import Link from 'next/link';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md) var(--space-xl);
  background: var(--background);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  height: 70px;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
`;

const ModernButton = styled.button`
  padding: var(--space-sm) var(--space-lg);
  font-size: var(--font-medium);
  font-weight: 500;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
`;

const PrimaryButton = styled(ModernButton)`
  background: var(--primary-color);
  color: var(--background);
  border-color: var(--primary-color);

  &:hover {
    background: var(--primary-hover);
    border-color: var(--primary-hover);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }
`;

const SecondaryButton = styled(ModernButton)`
  background: var(--background);
  color: var(--text-primary);
  border-color: var(--border-color);

  &:hover {
    background: var(--background-tertiary);
    border-color: var(--primary-color);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }
`;

const AdminButton = styled(PrimaryButton)`
  background: var(--warning-color);
  border-color: var(--warning-color);

  &:hover {
    background: #d97706;
    border-color: #d97706;
  }
`;

const AppName = styled.h1`
  font-size: var(--font-xl);
  font-weight: 700;
  margin: 0;
  color: var(--text-primary);
  cursor: pointer;
  text-decoration: none;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--text-secondary);
  font-size: var(--font-small);
  font-weight: 500;
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--background);
  font-weight: 600;
  font-size: var(--font-small);
`;

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
