import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import UsersTable from '@/components/admin/UsersTable'; // Import the client-side component

const prisma = new PrismaClient();

export default async function AdminUsersPage() {
  // Get session on the server
  const session = await getServerSession(authOptions);
  console.log(session.user);
  // If not an admin, redirect immediately
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  // Fetch users on the server
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, verified: true },
  });

  return <UsersTable users={users} />;
}
