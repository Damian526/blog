'use client';

import { useRouter } from 'next/navigation';
import styled from 'styled-components';

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
  const router = useRouter();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {session.user?.email}! Manage your blog posts here.</p>
      <Button onClick={() => router.push('/dashboard/new')}>
        Create New Post
      </Button>
    </div>
  );
}
