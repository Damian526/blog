import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    // Not signed in
    return (
      <div>
        <h1>Not Authenticated</h1>
        <a href="/auth/signin">Sign In</a>
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome, {session.user?.email}</h1>
      <p>This is a protected dashboard.</p>
    </div>
  );
}
