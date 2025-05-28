'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import LoginButton from '@/components/auth/LoginButton';
import RegisterButton from '@/components/auth/RegisterButton';
import LogoutButton from '@/components/auth/LogoutButton';
import Link from 'next/link';
import Image from 'next/image';
import {
  HeaderContainer,
  ButtonContainer,
  PrimaryButton,
  AdminButton,
  AppName,
  UserInfo,
  UserAvatar,
  MobileMenuButton,
  MobileMenu,
  DesktopButtonContainer,
} from '@/styles/components/layout/Header.styles';

interface User {
  id: number;
  name: string;
  email: string;
  profilePicture?: string;
  role: string;
  verified: boolean;
  createdAt: string;
}

export default function Header() {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fetch user profile data to get profile picture
  const { data: userProfile, error: profileError } = useSWR<User>(
    session?.user?.email ? '/api/user/profile' : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      shouldRetryOnError: false,
      errorRetryCount: 2,
    },
  );

  if (status === 'loading') {
    return (
      <HeaderContainer>
        <AppName>WebDevSphere</AppName>
        <div>Loading...</div>
      </HeaderContainer>
    );
  }

  const getUserInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return 'U';
  };

  const renderUserAvatar = () => {
    if (userProfile?.profilePicture) {
      return (
        <UserAvatar>
          <Image
            src={userProfile.profilePicture}
            alt="Profile Picture"
            fill
            style={{ objectFit: 'cover' }}
            sizes="40px"
          />
        </UserAvatar>
      );
    }

    return (
      <UserAvatar>
        {getUserInitials(session?.user.name, session?.user.email)}
      </UserAvatar>
    );
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <HeaderContainer>
      <Link href="/" passHref legacyBehavior>
        <AppName as="a" onClick={closeMobileMenu}>
          WebDevSphere
        </AppName>
      </Link>

      {/* Desktop Navigation */}
      <DesktopButtonContainer>
        {session ? (
          <>
            <Link href="/profile" passHref legacyBehavior>
              <UserInfo as="a" title="Go to Profile">
                {renderUserAvatar()}
                <span>Welcome, {session.user.name || session.user.email}</span>
              </UserInfo>
            </Link>
            {session.user.role === 'ADMIN' && (
              <Link href="/admin" passHref>
                <AdminButton>Admin Panel</AdminButton>
              </Link>
            )}
            <Link href="/dashboard" passHref>
              <PrimaryButton>Dashboard</PrimaryButton>
            </Link>
            <LogoutButton />
          </>
        ) : (
          <>
            <LoginButton />
            <RegisterButton />
          </>
        )}
      </DesktopButtonContainer>

      {/* Mobile Menu Button */}
      <MobileMenuButton onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? '✕' : '☰'}
      </MobileMenuButton>

      {/* Mobile Menu */}
      <MobileMenu $isOpen={isMobileMenuOpen}>
        {session ? (
          <>
            <Link href="/profile" passHref legacyBehavior>
              <UserInfo as="a" onClick={closeMobileMenu} title="Go to Profile">
                {renderUserAvatar()}
                <span>Welcome, {session.user.name || session.user.email}</span>
              </UserInfo>
            </Link>
            {session.user.role === 'ADMIN' && (
              <Link href="/admin" passHref>
                <AdminButton onClick={closeMobileMenu}>Admin Panel</AdminButton>
              </Link>
            )}
            <Link href="/dashboard" passHref>
              <PrimaryButton onClick={closeMobileMenu}>Dashboard</PrimaryButton>
            </Link>
            <LogoutButton onClick={closeMobileMenu} />
          </>
        ) : (
          <>
            <LoginButton onClick={closeMobileMenu} />
            <RegisterButton onClick={closeMobileMenu} />
          </>
        )}
      </MobileMenu>
    </HeaderContainer>
  );
}
