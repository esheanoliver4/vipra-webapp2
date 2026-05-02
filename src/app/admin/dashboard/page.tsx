import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getUser, getUserProfile } from '@/lib/auth-server';
import AdminClient from '@/components/admin/AdminClient';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Manage users and approve profiles',
};

export default async function AdminDashboardPage() {
  const user = await getUser();
  
  if (!user) {
    redirect('/login');
  }

  const profile = await getUserProfile();
  if (profile?.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <main className="min-h-screen bg-background">
      <AdminClient userId={user.id} />
    </main>
  );
}
