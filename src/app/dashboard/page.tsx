import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import DashboardContent from '@/components/ui/DashboardContent';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    // Redirect unauthenticated users to the sign-in page
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>Access Denied</h1>
        <a
          href="/auth/signin"
          style={{ color: '#0070f3', textDecoration: 'underline' }}
        >
          Sign In
        </a>
      </div>
    );
  }

  return <DashboardContent session={session} />;
}
