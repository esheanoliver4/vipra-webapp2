import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth-server';
import DashboardClient from '@/components/dashboard/DashboardClient';

export const metadata = {
  title: 'Dashboard - Viprapariwar',
  description: 'Your Viprapariwar dashboard'
};

export default async function DashboardPage() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <DashboardClient />
      </div>
    </main>
  );
}
