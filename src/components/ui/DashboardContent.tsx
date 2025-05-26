'use client';

import { useRouter } from 'next/navigation';
import { Session } from 'next-auth';
import {
  DashboardHeader,
  Title,
  WelcomeText,
  ActionButton,
  UserBadge,
} from '@/styles/components/ui/Dashboard.styles';

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
