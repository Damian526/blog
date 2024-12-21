'use client';

import styled from 'styled-components';
import LoginButton from '@/components/auth/LoginButton';
import RegisterButton from '@/components/auth/ReigsterButton'; // Import Register Button

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background: #f8f9fa;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px; // Space between buttons
`;

export default function Header() {
  return (
    <HeaderContainer>
      <h1>My Blog</h1>
      <ButtonContainer>
        <LoginButton />
        <RegisterButton />
      </ButtonContainer>
    </HeaderContainer>
  );
}
