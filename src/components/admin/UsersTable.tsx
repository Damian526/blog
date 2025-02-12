'use client'; // ✅ This makes it a client component

import {
  Container,
  Title,
  Table,
  Th,
  Td,
  Row,
} from '@/styles/admin/users/users.styles';

export default function UsersTable({ users }) {
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
