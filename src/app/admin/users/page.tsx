import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import UsersTable from '@/components/admin/UsersTable';

export default async function AdminUsersPage() {
  // Get session on the server
  const session = await getServerSession(authOptions);
  // If not an admin, redirect immediately
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  // No need to fetch users on the server anymore - UsersTable handles it with SWR
  return <UsersTable />;
}
