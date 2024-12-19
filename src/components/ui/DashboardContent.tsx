'use client';

import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
`;

const Button = styled.button`
  background-color: #0070f3;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #005bb5;
  }
`;

export default function DashboardContent({ session }: { session: any }) {
  return (
    <Container>
      <Title>Dashboard</Title>
      <p>Welcome, {session.user?.email}! Manage your blog posts here.</p>
      <Button>Create New Post</Button>
    </Container>
  );
}
