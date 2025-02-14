'use client';

import { useState } from 'react';
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
  role: 'ADMIN' | 'USER';
  verified: boolean;
}

// Expl

export default function UsersTable({ users }: { users: User[] }) {
  const [userList, setUserList] = useState(users);

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

      // Remove the deleted user from the UI without reloading
      setUserList(userList.filter((user) => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  }

  return (
    <Container>
      <Title>Admin Panel - User List</Title>
      <Table>
        <thead>
          <tr>
            <Th>ID</Th>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Role</Th>
            <Th>Verified</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {userList.map((user) => (
            <Row key={user.id}>
              <Td>{user.id}</Td>
              <Td>{user.name}</Td>
              <Td>{user.email}</Td>
              <Td>{user.role}</Td>
              <Td>{user.verified ? '✅' : '❌'}</Td>
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
