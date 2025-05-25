'use client';

import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { Session } from 'next-auth';

const DashboardHeader = styled.div`
  background: var(--background);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-light);
  margin-bottom: var(--space-xl);
`;

const Title = styled.h1`
  font-size: var(--font-xxl);
  font-weight: 700;
  margin: 0 0 var(--space-md) 0;
  color: var(--text-primary);
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const WelcomeText = styled.p`
  font-size: var(--font-large);
  color: var(--text-secondary);
  margin: 0 0 var(--space-xl) 0;
  line-height: 1.6;
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-xl);
  font-size: var(--font-medium);
  font-weight: 600;
  background: var(--primary-color);
  color: var(--background);
  border: 1px solid var(--primary-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;

  &:hover {
    background: var(--primary-hover);
    border-color: var(--primary-hover);
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  &::before {
    content: '+';
    font-size: var(--font-large);
    font-weight: 700;
  }
`;

const UserBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background: rgba(37, 99, 235, 0.1);
  color: var(--primary-color);
  border-radius: var(--radius-md);
  font-size: var(--font-small);
  font-weight: 600;
  border: 1px solid rgba(37, 99, 235, 0.2);
  margin-bottom: var(--space-md);

  &::before {
    content: '👋';
    font-size: var(--font-medium);
  }
`;

interface DashboardContentProps {
  session: Session | null;
}

export default function DashboardContent({ session }: DashboardContentProps) {
  const router = useRouter();

  return (
    <DashboardHeader>
      <UserBadge>
        Welcome back, {session?.user?.name || session?.user?.email || 'Guest'}!
      </UserBadge>
      <Title>Dashboard</Title>
      <WelcomeText>
        Manage your blog posts, create new content, and track your publishing activity.
      </WelcomeText>
      <ActionButton onClick={() => router.push('/dashboard/new')}>
        Create New Post
      </ActionButton>
    </DashboardHeader>
  );
}
