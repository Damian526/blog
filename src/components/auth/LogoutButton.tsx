'use client';

import { signOut } from 'next-auth/react';
import styled from 'styled-components';

const Button = styled.button`
  padding: 12px 20px;
  background-color: #f44336;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #d32f2f;
  }
`;

export default function LogoutButton() {
  return <Button onClick={() => signOut({ callbackUrl: '/' })}>Logout</Button>;
}
