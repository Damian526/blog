'use client';

import Link from 'next/link';
import styled from 'styled-components';

// Styled anchor for links
const StyledAnchor = styled.a`
  display: inline-block;
  color: #0070f3;
  text-decoration: none;
  font-weight: bold;
  margin-top: 10px;
  transition: color 0.3s;

  &:hover {
    text-decoration: underline;
    color: #005bb5;
  }
`;

type StyledLinkProps = {
  href: string;
  children: React.ReactNode;
};

export default function StyledLink({ href, children }: StyledLinkProps) {
  return (
    <Link href={href} passHref>
      <StyledAnchor>{children}</StyledAnchor>
    </Link>
  );
}
