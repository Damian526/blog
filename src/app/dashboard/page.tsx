'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import DashboardContent from '@/components/ui/DashboardContent';
import LoginForm from '@/components/auth/LoginForm';
import Modal from '@/components/ui/Modal';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Automatically show login modal if unauthenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      setShowLoginModal(true);
    }
  }, [status]);

  // Show loading indicator while session is being fetched
  if (status === 'loading') {
    return <p>Loading session...</p>;
  }

  // Show dashboard content if user is authenticated
  if (session) {
    return <DashboardContent session={session} />;
  }

  // If not authenticated, show login modal and fallback message
  return (
    <>
      <p style={{ textAlign: 'center', marginTop: '40px' }}>
        Please login to access the dashboard.
      </p>

      <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)}>
        <LoginForm onClose={() => setShowLoginModal(false)} />
      </Modal>
    </>
  );
}
