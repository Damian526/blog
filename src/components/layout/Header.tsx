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
      <AppName as={Link} href="/" onClick={closeMobileMenu}>
        WebDevSphere
      </AppName>

      {/* Desktop Navigation */}
      <DesktopButtonContainer>
        {session ? (
          <>
            <UserInfo as={Link} href="/profile" title="Go to Profile">
              {renderUserAvatar()}
              <span>Welcome, {session.user.name || session.user.email}</span>
            </UserInfo>
            {session.user.role === 'ADMIN' && (
              <AdminButton as={Link} href="/admin">
                Admin Panel
              </AdminButton>
            )}
            <PrimaryButton as={Link} href="/dashboard">
              Dashboard
            </PrimaryButton>
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
            <UserInfo
              as={Link}
              href="/profile"
              onClick={closeMobileMenu}
              title="Go to Profile"
            >
              {renderUserAvatar()}
              <span>Welcome, {session.user.name || session.user.email}</span>
            </UserInfo>
            {session.user.role === 'ADMIN' && (
              <AdminButton as={Link} href="/admin" onClick={closeMobileMenu}>
                Admin Panel
              </AdminButton>
            )}
            <PrimaryButton
              as={Link}
              href="/dashboard"
              onClick={closeMobileMenu}
            >
              Dashboard
            </PrimaryButton>
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
