import { redirect } from 'next/navigation';
import { getUser, getUserProfile } from '@/lib/auth-server';
import UserDetailClient from './UserDetailClient';

export default async function AdminUserViewPage({ params }: { params: { id: string } }) {
  const user = await getUser();
  
  if (!user) {
    redirect('/login');
  }

  const profile = await getUserProfile();
  if (profile?.role !== 'admin') {
    redirect('/dashboard');
  }

  const { id } = await params;
  
  return <UserDetailClient userId={id} />;
}
