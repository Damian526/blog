'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ProfileForm from '@/components/profile/ProfileForm';
import styled from 'styled-components';

const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: var(--space-responsive-xl);
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: var(--space-lg);
  }
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: var(--space-xl);
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-md);
  background: linear-gradient(
    135deg,
    var(--primary-color),
    var(--accent-color)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

const PageDescription = styled.p`
  font-size: var(--font-large);
  color: var(--text-secondary);
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 768px) {
    font-size: var(--font-medium);
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: var(--space-xl);
  color: var(--text-secondary);
  font-size: var(--font-large);
`;

const UnauthenticatedMessage = styled.div`
  text-align: center;
  padding: var(--space-xl);
  background: var(--background);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-light);

  h2 {
    color: var(--text-primary);
    margin-bottom: var(--space-md);
  }

  p {
    color: var(--text-secondary);
    margin-bottom: var(--space-lg);
  }

  a {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <PageContainer>
        <LoadingMessage>Loading your profile...</LoadingMessage>
      </PageContainer>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <PageContainer>
        <UnauthenticatedMessage>
          <h2>Access Denied</h2>
          <p>You need to be logged in to access your profile.</p>
          <a href="/auth/login">Please log in to continue</a>
        </UnauthenticatedMessage>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Profile Settings</PageTitle>
        <PageDescription>
          Manage your account information, update your details, and change your
          password.
        </PageDescription>
      </PageHeader>
      <ProfileForm />
    </PageContainer>
  );
}
