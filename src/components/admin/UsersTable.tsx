'use client';

import useSWR from 'swr';
import {
  Container,
  Title,
  Table,
  Th,
  Td,
  Row,
} from '@/styles/admin/users/users.styles';

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

  const users = data?.users;

  async function handleDelete(userId: number) {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) {
        throw new Error('Failed to delete user');
      }

      // Revalidate the users list to get fresh data
      mutate();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
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
      <Title>Admin Panel - User List</Title>
      <Table>
        <thead>
          <tr>
            <Th>ID</Th>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Status</Th>
            <Th>Expert</Th>
            <Th>Role</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {(users || []).map((user) => (
            <Row key={user.id}>
              <Td>{user.id}</Td>
              <Td>{user.name}</Td>
              <Td>{user.email}</Td>
              <Td>{user.status}</Td>
              <Td>{user.isExpert ? '✅' : '❌'}</Td>
              <Td>{user.role}</Td>
              <Td>
                {user.role !== 'ADMIN' && (
                  <button
                    onClick={() => handleDelete(user.id)}
                    style={{
                      padding: '5px 10px',
                      background: 'red',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '5px',
                    }}
                  >
                    Delete
                  </button>
                )}
              </Td>
            </Row>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
