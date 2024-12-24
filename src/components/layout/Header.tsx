'use client';

import styled from 'styled-components';
import { useSession } from 'next-auth/react';
import LoginButton from '@/components/auth/LoginButton';
import RegisterButton from '@/components/auth/ReigsterButton';
import LogoutButton from '@/components/auth/LogoutButton';

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
          <LogoutButton />
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
