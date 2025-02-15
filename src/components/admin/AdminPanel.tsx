'use client'; 

import styled from 'styled-components';
import Link from 'next/link';

const AdminContainer = styled.div`
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const AdminTitle = styled.h1`
  font-size: 24px;
  color: #333;
`;

const AdminLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
`;

const AdminLink = styled(Link)`
  padding: 12px 20px;
  font-size: 1.2rem;
  text-decoration: none;
  color: white;
  background-color: #0070f3;
  border-radius: 5px;
  transition: 0.2s ease-in-out;

  &:hover {
    background-color: #005bb5;
  }
`;

export default function AdminPanel() {
  return (
    <AdminContainer>
      <AdminTitle>Admin Panel</AdminTitle>
      <AdminLinks>
        <AdminLink href="/admin/users">👥 Manage Users</AdminLink>
        <AdminLink href="/admin/posts">📝 Manage Posts</AdminLink>
      </AdminLinks>
    </AdminContainer>
  );
}
