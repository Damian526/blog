'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Title,
  Table,
  Th,
  Td,
  Row,
} from '@/styles/admin/users/users.styles';

export default function AdminPanel() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user.role !== 'admin') {
      router.push('/');
      return;
    }

    async function fetchUsers() {
      try {
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error('Failed to load users:', error);
      }
    }

    fetchUsers();
  }, [session, status, router]);

  if (status === 'loading') return <p>Loading...</p>;

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
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <Row key={user.id}>
              <Td>{user.id}</Td>
              <Td>{user.name}</Td>
              <Td>{user.email}</Td>
              <Td>{user.role}</Td>
              <Td>{user.verified ? '✅' : '❌'}</Td>
            </Row>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
