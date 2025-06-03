'use client';

import { useState } from 'react';
import styled from 'styled-components';
import useSWR from 'swr';
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
  verified: boolean;
  isExpert: boolean;
  verificationReason?: string | null;
  portfolioUrl?: string | null;
  role: string;
  createdAt: string;
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
    if (userData.verified && userData.isExpert) return 'verified';
    if (userData.verified) return 'approved';
    return 'pending';
  };

  const getStatusLabel = () => {
    if (userData.verified && userData.isExpert) return '⭐ Verified Expert';
    if (userData.verified) return '✅ Community Member';
    return '⏳ Pending Approval';
  };

  const getStatusDescription = () => {
    if (userData.role === 'ADMIN') {
      return '🛡️ You have administrator privileges.';
    }
    if (userData.verified && userData.isExpert) {
      return 'You can write articles and participate in all discussions.';
    }
    if (userData.verified) {
      return 'You can participate in discussions and comment on posts.';
    }
    return 'Your account is pending approval. You can view content but cannot participate yet.';
  };

  const showVerificationPrompt = () => {
    return (
      userData.verified && !userData.isExpert && !userData.verificationReason
    );
  };

  const showApplicationStatus = () => {
    return userData.verificationReason && !userData.verified;
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

        {showVerificationPrompt() && (
          <StatusInfo>
            💡 Want to write articles? Apply to become a verified expert!
          </StatusInfo>
        )}

        {showApplicationStatus() && (
          <StatusInfo>
            <strong>Expert Application Status:</strong> Your application is
            under review.
          </StatusInfo>
        )}

        {showVerificationPrompt() && !showApplicationForm && (
          <ActionButton onClick={() => setShowApplicationForm(true)}>
            Apply to Become an Expert
          </ActionButton>
        )}
      </StatusCard>

      {showApplicationForm && showVerificationPrompt() && (
        <ExpertApplicationForm onSuccess={handleApplicationSuccess} />
      )}
    </>
  );
}
