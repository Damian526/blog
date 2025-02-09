'use client';

import styled from 'styled-components';
import { useSession } from 'next-auth/react';
import LoginButton from '@/components/auth/LoginButton';
import RegisterButton from '@/components/auth/ReigsterButton';
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

export default function Header() {
  const { data: session, status } = useSession();
  if (status === 'loading') {
    return <HeaderContainer>Loading...</HeaderContainer>;
  }

  return (
    <HeaderContainer>
      <h1>My Blog</h1>
      <ButtonContainer>
        {session ? (
          <>
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
