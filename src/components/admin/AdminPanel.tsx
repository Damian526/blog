'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { useAdminStats } from '@/hooks/useAdmin';
import type { AdminStats } from '@/server/api/types';

const AdminContainer = styled.div`
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const AdminTitle = styled.h1`
  font-size: 2rem;
  color: #1e293b;
  margin-bottom: 1rem;
  font-weight: 700;
`;

const AdminSubtitle = styled.p`
  color: #64748b;
  font-size: 1.1rem;
  margin-bottom: 2rem;
`;

const AdminGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const AdminCard = styled(Link)`
  padding: 2rem;
  text-decoration: none;
  color: white;
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &.users {
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  }

  &.posts {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const CardIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const CardDescription = styled.p`
  font-size: 0.95rem;
  opacity: 0.9;
  margin-bottom: 1rem;
`;

const Badge = styled.span`
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
`;

const LoadingCard = styled.div`
  padding: 2rem;
  background: #f8fafc;
  border-radius: 12px;
  color: #64748b;
`;

interface AdminStatsData {
  users: {
    total: number;
    pending: number;
    applications: number;
  };
}

export default function AdminPanel() {
  const {
    stats,
    error,
    isLoading,
  } = useAdminStats();

  // Type guard to ensure stats has the correct type
  const typedStats = stats as AdminStats | undefined;

  return (
    <AdminContainer>
      <AdminTitle>🛡️ Admin Dashboard</AdminTitle>
      <AdminSubtitle>
        Manage users, review expert applications, and oversee content
      </AdminSubtitle>

      <AdminGrid>
        <AdminCard href="/admin/users" className="users">
          <CardIcon>👥</CardIcon>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            Manage users, approve accounts, and review expert applications
          </CardDescription>
          {isLoading ? (
            <Badge>Loading...</Badge>
          ) : error ? (
            <Badge>Error loading stats</Badge>
          ) : typedStats ? (
            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Badge>{typedStats.users.total} Total Users</Badge>
              {typedStats.users.pending > 0 && (
                <Badge>⏳ {typedStats.users.pending} Pending</Badge>
              )}
              {typedStats.users.verificationRequests > 0 && (
                <Badge>🎯 {typedStats.users.verificationRequests} Applications</Badge>
              )}
            </div>
          ) : null}
        </AdminCard>

        <AdminCard href="/admin/posts" className="posts">
          <CardIcon>📝</CardIcon>
          <CardTitle>Content Management</CardTitle>
          <CardDescription>
            Review posts, manage publications, and moderate content
          </CardDescription>
          <Badge>Manage Posts</Badge>
        </AdminCard>
      </AdminGrid>
    </AdminContainer>
  );
}
