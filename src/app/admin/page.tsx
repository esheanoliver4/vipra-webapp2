import { redirect } from 'next/navigation';
import { getUser, getUserProfile } from '@/lib/auth-server';
import AdminClient from '@/components/admin/AdminClient';

export default async function AdminPage() {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <AdminClient userId={user.id} />
      </div>
    </main>
  );
}
