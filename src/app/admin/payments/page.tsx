import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getUser, getUserProfile } from '@/lib/auth-server';
import PaymentsClient from '@/components/admin/PaymentsClient';

export const metadata: Metadata = {
  title: 'Payment Verification | Admin Panel',
  description: 'Approve or reject premium subscription payments',
};

export default async function AdminPaymentsPage() {
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
      <PaymentsClient />
    </main>
  );
}
