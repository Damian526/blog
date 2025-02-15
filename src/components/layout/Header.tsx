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
  padding: 10px 20px;
  background: #f8f9fa;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
`;

const DashboardButton = styled.button`
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

const AdminButton = styled(DashboardButton)`
  background-color: #ff5722;

  &:hover {
    background-color: #e64a19;
  }
`;

const AppName = styled.h1`
  font-size: 1.5rem;
  margin: 0;
  color: #333;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    color: #0070f3;
  }
`;

export default function Header() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <HeaderContainer>Loading...</HeaderContainer>;
  }

  return (
    <HeaderContainer>
      <Link href="/" passHref legacyBehavior>
        <AppName as="a">WebDevSphere</AppName>
      </Link>
      <ButtonContainer>
        {session ? (
          <>
            {session.user.role === 'ADMIN' && (
              <Link href="/admin" passHref>
                <AdminButton>Admin Panel</AdminButton>
              </Link>
            )}
            <Link href="/dashboard" passHref>
              <DashboardButton>Dashboard</DashboardButton>
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
