'use client';

import styled from 'styled-components';
import LoginButton from '@/components/auth/LoginButton';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background: #f8f9fa;
`;

export default function Header() {
  return (
    <HeaderContainer>
      <h1>My Blog</h1>
      <LoginButton />
    </HeaderContainer>
  );
}
