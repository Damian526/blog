'use client';

import { useState } from 'react';
import useSWR from 'swr';
import styled from 'styled-components';
import { useSession } from 'next-auth/react';
import ExpertApplicationForm from '@/components/ui/forms/ExpertApplicationForm';

const StatusCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid #e2e8f0;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  margin-top: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const StatusHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const StatusTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '👤';
    font-size: 1.1rem;
  }
`;

const StatusBadge = styled.span<{
  variant: 'pending' | 'approved' | 'verified' | 'admin';
}>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;

  ${({ variant }) => {
    switch (variant) {
      case 'pending':
        return `
          background-color: #fef3c7;
          color: #d97706;
          border: 1px solid #fbbf24;
        `;
      case 'approved':
        return `
          background-color: #d1fae5;
          color: #059669;
          border: 1px solid #34d399;
        `;
      case 'verified':
        return `
          background-color: #e0e7ff;
          color: #5b21b6;
          border: 1px solid #8b5cf6;
        `;
      case 'admin':
        return `
          background-color: #fee2e2;
          color: #dc2626;
          border: 1px solid #f87171;
        `;
      default:
        return `
          background-color: #f1f5f9;
          color: #64748b;
          border: 1px solid #cbd5e1;
        `;
    }
  }}
`;

const StatusInfo = styled.div`
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(99, 102, 241, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const LoadingText = styled.div`
  color: #64748b;
  font-size: 0.95rem;
  text-align: center;
  padding: 1rem;
`;

interface UserData {
  id: number;
  name: string;
  email: string;
  status: 'PENDING' | 'APPROVED' | 'VERIFIED';
  role: 'USER' | 'ADMIN';
  isExpert: boolean;
  verificationReason?: string | null;
  portfolioUrl?: string | null;
}

export default function UserStatusCard() {
  const { data: session } = useSession();
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  const {
    data: userData,
    error,
    isLoading,
    mutate,
  } = useSWR<UserData>(session ? '/api/user/profile' : null, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    shouldRetryOnError: false,
  });

  const handleApplicationSuccess = () => {
    setShowApplicationForm(false);
    mutate(); // Refresh user data
  };

  if (!session) return null;

  if (isLoading) {
    return (
      <StatusCard>
        <LoadingText>Loading your status...</LoadingText>
      </StatusCard>
    );
  }

  if (error || !userData) {
    return (
      <StatusCard>
        <StatusTitle>Status Information</StatusTitle>
        <StatusInfo>Unable to load status information.</StatusInfo>
      </StatusCard>
    );
  }

  const getStatusVariant = () => {
    if (userData.role === 'ADMIN') return 'admin';
    if (userData.status === 'VERIFIED') return 'verified';
    if (userData.status === 'APPROVED') return 'approved';
    return 'pending';
  };

  const getStatusLabel = () => {
    if (userData.role === 'ADMIN') return '👑 Administrator';
    if (userData.status === 'VERIFIED') return '⭐ Verified Expert';
    if (userData.status === 'APPROVED') return '✅ Community Member';
    return '⏳ Pending Approval';
  };

  const getStatusDescription = () => {
    if (userData.role === 'ADMIN') {
      return 'You have full administrative access to manage the platform.';
    }
    if (userData.status === 'VERIFIED') {
      return 'You are a verified expert and can write articles and share your knowledge with the community.';
    }
    if (userData.status === 'APPROVED') {
      return 'You are an approved community member and can participate in discussions and comment on posts.';
    }
    return 'Your account is pending approval. You can browse content but cannot post or comment yet.';
  };

  const canApplyForExpert = () => {
    return (
      userData.status === 'APPROVED' &&
      userData.role !== 'ADMIN' &&
      !userData.verificationReason
    ); // No pending application
  };

  const hasPendingApplication = () => {
    return userData.verificationReason && userData.status !== 'VERIFIED';
  };

  return (
    <>
      <StatusCard>
        <StatusHeader>
          <StatusTitle>Account Status</StatusTitle>
          <StatusBadge variant={getStatusVariant()}>
            {getStatusLabel()}
          </StatusBadge>
        </StatusHeader>

        <StatusInfo>{getStatusDescription()}</StatusInfo>

        {hasPendingApplication() && (
          <StatusInfo>
            <strong>Expert Application Status:</strong> Your application is
            under review. You will be notified once it has been processed.
          </StatusInfo>
        )}

        {canApplyForExpert() && !showApplicationForm && (
          <ActionButton onClick={() => setShowApplicationForm(true)}>
            Apply to Become an Expert
          </ActionButton>
        )}
      </StatusCard>

      {showApplicationForm && canApplyForExpert() && (
        <ExpertApplicationForm onSuccess={handleApplicationSuccess} />
      )}
    </>
  );
}
