import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getDashboardPosts } from '@/lib/queries/posts';
import DashboardClient from '@/components/dashboard/DashboardClient';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  // If not authenticated, show login prompt
  if (!session) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1>Please login to access the dashboard.</h1>
      </div>
    );
  }

  // Get initial posts data on the server
  const initialPosts = await getDashboardPosts();

  return <DashboardClient initialPosts={initialPosts} />;
}
