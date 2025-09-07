'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { useAdminUsers } from '@/hooks/useAdmin';
import { User } from '@/server/api';
import { api } from '@/server/api';
import {
  Container,
  Title,
  Table,
  Th,
  Td,
  Row,
} from '@/styles/admin/users/users.styles';

const ActionButton = styled.button<{
  variant?: 'approve' | 'reject' | 'delete';
}>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 0 0.25rem;

  ${({ variant }) => {
    switch (variant) {
      case 'approve':
        return `
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          color: white;
          &:hover { transform: translateY(-1px); box-shadow: 0 2px 4px rgba(5, 150, 105, 0.3); }
        `;
      case 'reject':
        return `
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          color: white;
          &:hover { transform: translateY(-1px); box-shadow: 0 2px 4px rgba(220, 38, 38, 0.3); }
        `;
      case 'delete':
        return `
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          &:hover { transform: translateY(-1px); box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3); }
        `;
      default:
        return `
          background: #f1f5f9;
          color: #64748b;
          &:hover { background: #e2e8f0; }
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const StatusBadge = styled.span<{ verified: boolean; isExpert: boolean }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;

  ${({ verified, isExpert }) => {
    if (verified && isExpert) {
      return `
        background-color: #e3f2fd;
        color: #1976d2;
      `;
    } else if (verified) {
      return `
        background-color: #e8f5e8;
        color: #2e7d32;
      `;
    } else {
      return `
        background-color: #fff3e0;
        color: #f57c00;
      `;
    }
  }}
`;

const ApplicationDetails = styled.div`
  margin-top: 0.5rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 4px solid #6366f1;
`;

const ApplicationTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  color: #1e293b;
  font-size: 0.875rem;
  font-weight: 600;
`;

const ApplicationText = styled.p`
  margin: 0.5rem 0;
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1.4;
`;

const PortfolioLink = styled.a`
  color: #6366f1;
  text-decoration: none;
  font-size: 0.875rem;
  &:hover {
    text-decoration: underline;
  }
`;

const FilterButtons = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ active?: boolean }>`
  padding: 0.5rem 1rem;
  border: 2px solid ${({ active }) => (active ? '#6366f1' : '#e2e8f0')};
  background: ${({ active }) => (active ? '#6366f1' : '#ffffff')};
  color: ${({ active }) => (active ? '#ffffff' : '#64748b')};
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #6366f1;
    background: ${({ active }) => (active ? '#6366f1' : '#f8fafc')};
  }
`;

export default function UsersTable() {
  const { 
    users, 
    error, 
    isLoading, 
    approveUser,
    isApproving,
    rejectUser,
    isRejecting,
    updateUserRole,
    isUpdatingRole,
    refetch 
  } = useAdminUsers();

  const [filter, setFilter] = useState<
    'all' | 'pending' | 'verification-requests'
  >('all');
  const [processingUsers, setProcessingUsers] = useState<Set<number>>(
    new Set(),
  );

  const getFilteredUsers = () => {
    if (!users) return [];
    
    if (filter === 'pending') {
      return users.filter((user) => !user.verified && !user.verificationReason);
    }
    if (filter === 'verification-requests') {
      return users.filter((user) => user.verificationReason && !user.verified);
    }
    return users;
  };

  async function handleUserAction(
    userId: number,
    action: 'approve' | 'verify' | 'reject',
  ) {
    if (processingUsers.has(userId)) return;

    const confirmMessage =
      action === 'approve'
        ? 'Are you sure you want to approve this user?'
        : action === 'verify'
          ? 'Are you sure you want to verify this user as an expert?'
          : 'Are you sure you want to reject this application?';

    if (!confirm(confirmMessage)) return;

    setProcessingUsers((prev) => new Set(prev.add(userId)));

    try {
      if (action === 'approve') {
        await approveUser(userId);
      } else if (action === 'reject') {
        await rejectUser({ userId, reason: 'Rejected by admin' });
      }
      // Note: 'verify' action might need a separate API function
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
      alert(
        `Failed to ${action} user: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    } finally {
      setProcessingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  }

  async function handleDelete(userId: number) {
    if (processingUsers.has(userId)) return;
    if (!confirm('Are you sure you want to delete this user?')) return;

    setProcessingUsers((prev) => new Set(prev.add(userId)));

    try {
      await api.admin.deleteUser(userId);
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    } finally {
      setProcessingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  }

  if (isLoading)
    return (
      <Container>
        <Title>Loading users...</Title>
      </Container>
    );
  if (error)
    return (
      <Container>
        <Title>Error loading users: {error.message}</Title>
      </Container>
    );
  if (!users || !Array.isArray(users))
    return (
      <Container>
        <Title>No users found</Title>
      </Container>
    );

  return (
    <Container>
      <Title>Admin Panel - User Management</Title>

      <FilterButtons>
        <FilterButton
          active={filter === 'all'}
          onClick={() => setFilter('all')}
        >
          All Users ({users.length})
        </FilterButton>
        <FilterButton
          active={filter === 'pending'}
          onClick={() => setFilter('pending')}
        >
          Pending Approval (
          {users.filter((u) => !u.verified && !u.verificationReason).length})
        </FilterButton>
        <FilterButton
          active={filter === 'verification-requests'}
          onClick={() => setFilter('verification-requests')}
        >
          Expert Requests (
          {users.filter((u) => u.verificationReason && !u.verified).length})
        </FilterButton>
      </FilterButtons>

      <Table>
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Verification Status</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {getFilteredUsers().map((user) => {
            const needsVerificationAction =
              user.verificationReason && !user.verified;

            return (
              <Row key={user.id}>
                <Td>
                  <div>
                    <strong>{user.name}</strong>
                    <br />
                    <small style={{ color: '#64748b' }}>{user.email}</small>
                    <br />
                    <small style={{ color: '#9ca3af' }}>ID: {user.id}</small>
                  </div>

                  {user.verificationReason && (
                    <ApplicationDetails>
                      <ApplicationTitle>🎯 Expert Application</ApplicationTitle>
                      <ApplicationText>
                        <strong>Reason:</strong> {user.verificationReason}
                      </ApplicationText>
                      {user.portfolioUrl && (
                        <ApplicationText>
                          <strong>Portfolio:</strong>{' '}
                          <PortfolioLink
                            href={user.portfolioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {user.portfolioUrl}
                          </PortfolioLink>
                        </ApplicationText>
                      )}
                    </ApplicationDetails>
                  )}
                </Td>
                <Td>{user.email}</Td>
                <Td>
                  <StatusBadge
                    verified={user.verified}
                    isExpert={user.isExpert}
                  >
                    {user.verified && user.isExpert
                      ? 'Verified Expert'
                      : user.verified
                        ? 'Verified'
                        : 'Pending'}
                  </StatusBadge>
                </Td>
                <Td>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                    }}
                  >
                    {needsVerificationAction && (
                      <>
                        <ActionButton
                          variant="approve"
                          onClick={() => handleUserAction(user.id, 'verify')}
                          disabled={processingUsers.has(user.id)}
                        >
                          ✅ Verify as Expert
                        </ActionButton>
                        <ActionButton
                          variant="approve"
                          onClick={() => handleUserAction(user.id, 'approve')}
                          disabled={processingUsers.has(user.id)}
                        >
                          ✅ Approve Only
                        </ActionButton>
                        <ActionButton
                          variant="reject"
                          onClick={() => handleUserAction(user.id, 'reject')}
                          disabled={processingUsers.has(user.id)}
                        >
                          ❌ Reject
                        </ActionButton>
                      </>
                    )}

                    {!user.verified && !user.verificationReason && (
                      <ActionButton
                        variant="approve"
                        onClick={() => handleUserAction(user.id, 'approve')}
                        disabled={processingUsers.has(user.id)}
                      >
                        ✅ Approve User
                      </ActionButton>
                    )}

                    {user.role !== 'ADMIN' && (
                      <ActionButton
                        variant="delete"
                        onClick={() => handleDelete(user.id)}
                        disabled={processingUsers.has(user.id)}
                      >
                        {processingUsers.has(user.id)
                          ? 'Deleting...'
                          : 'Delete'}
                      </ActionButton>
                    )}
                  </div>
                </Td>
              </Row>
            );
          })}
        </tbody>
      </Table>

      {getFilteredUsers().length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
          No users found for the selected filter.
        </div>
      )}
    </Container>
  );
}
