'use client';

import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import StyledLink from '@/components/ui/StyledLink';
import styled from 'styled-components';

// Styled Components for the Dashboard page
const Container = styled.div`
  text-align: center;
  margin-top: 50px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 20px;
`;

const Paragraph = styled.p`
  font-size: 1.2rem;
  color: #666;
`;

export default function Dashboard() {
  const session = getServerSession(authOptions);

  if (!session) {
    return (
      <Container>
        <Title>Not Authenticated</Title>
        <StyledLink href="/auth/signin">Sign In</StyledLink>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Welcome, {session.user?.email}</Title>
      <Paragraph>This is a protected dashboard.</Paragraph>
    </Container>
  );
}
