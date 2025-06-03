'use client';

import useSWR from 'swr';
import { useState } from 'react';
import styled from 'styled-components';
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

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;

  ${({ status }) => {
    switch (status) {
      case 'PENDING':
        return `background: #fef3c7; color: #d97706; border: 1px solid #fbbf24;`;
      case 'APPROVED':
        return `background: #d1fae5; color: #059669; border: 1px solid #34d399;`;
      case 'VERIFIED':
        return `background: #e0e7ff; color: #5b21b6; border: 1px solid #8b5cf6;`;
      default:
        return `background: #f1f5f9; color: #64748b; border: 1px solid #cbd5e1;`;
    }
  }}
`;

const ExpertBadge = styled.span<{ isExpert: boolean }>`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  ${({ isExpert }) =>
    isExpert
      ? `background: #dcfce7; color: #16a34a;`
      : `background: #f1f5f9; color: #64748b;`}
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

interface User {
  id: number;
  name: string;
  email: string;
  status: string;
  isExpert: boolean;
  role: string;
  createdAt: string;
  approvedAt: string | null;
  verificationReason: string | null;
  portfolioUrl: string | null;
}

export default function UsersTable() {
  const { data, error, isLoading, mutate } = useSWR<{ users: User[] }>(
    '/api/admin/users',
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      shouldRetryOnError: false,
    },
  );

  const [filter, setFilter] = useState<'all' | 'pending' | 'applications'>(
    'all',
  );
  const [processingUsers, setProcessingUsers] = useState<Set<number>>(
    new Set(),
  );

  const users = data?.users;

  const filteredUsers = users?.filter((user) => {
    switch (filter) {
      case 'pending':
        return user.status === 'PENDING';
      case 'applications':
        return user.verificationReason && user.status !== 'VERIFIED';
      default:
        return true;
    }
  });

  const pendingApplicationsCount =
    users?.filter(
      (user) => user.verificationReason && user.status !== 'VERIFIED',
    ).length || 0;

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
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Failed to ${action} user`);
      }

      // Revalidate the users list to get fresh data
      mutate();
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
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) {
        throw new Error('Failed to delete user');
      }

      mutate();
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
          Pending Approval ({users.filter((u) => u.status === 'PENDING').length}
          )
        </FilterButton>
        <FilterButton
          active={filter === 'applications'}
          onClick={() => setFilter('applications')}
        >
          Expert Applications ({pendingApplicationsCount})
        </FilterButton>
      </FilterButtons>

      <Table>
        <thead>
          <tr>
            <Th>User Info</Th>
            <Th>Status</Th>
            <Th>Expert</Th>
            <Th>Role</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {(filteredUsers || []).map((user) => {
            const hasApplication =
              user.verificationReason && user.status !== 'VERIFIED';
            const isProcessing = processingUsers.has(user.id);

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

                  {hasApplication && (
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
                <Td>
                  <StatusBadge status={user.status}>{user.status}</StatusBadge>
                </Td>
                <Td>
                  <ExpertBadge isExpert={user.isExpert}>
                    {user.isExpert ? 'Yes' : 'No'}
                  </ExpertBadge>
                </Td>
                <Td>{user.role}</Td>
                <Td>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                    }}
                  >
                    {/* Expert Application Actions */}
                    {hasApplication && (
                      <div>
                        <ActionButton
                          variant="approve"
                          onClick={() => handleUserAction(user.id, 'verify')}
                          disabled={isProcessing}
                        >
                          {isProcessing ? 'Processing...' : 'Approve Expert'}
                        </ActionButton>
                        <ActionButton
                          variant="reject"
                          onClick={() => handleUserAction(user.id, 'reject')}
                          disabled={isProcessing}
                        >
                          {isProcessing ? 'Processing...' : 'Reject App'}
                        </ActionButton>
                      </div>
                    )}

                    {/* User Status Actions */}
                    {user.status === 'PENDING' && !user.verificationReason && (
                      <ActionButton
                        variant="approve"
                        onClick={() => handleUserAction(user.id, 'approve')}
                        disabled={isProcessing}
                      >
                        {isProcessing ? 'Processing...' : 'Approve User'}
                      </ActionButton>
                    )}

                    {/* Delete Action */}
                    {user.role !== 'ADMIN' && (
                      <ActionButton
                        variant="delete"
                        onClick={() => handleDelete(user.id)}
                        disabled={isProcessing}
                      >
                        {isProcessing ? 'Deleting...' : 'Delete'}
                      </ActionButton>
                    )}
                  </div>
                </Td>
              </Row>
            );
          })}
        </tbody>
      </Table>

      {filteredUsers?.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
          No users found for the selected filter.
        </div>
      )}
    </Container>
  );
}
