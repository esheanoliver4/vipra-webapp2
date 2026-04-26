import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth-server';
import ProfileViewClient from '@/components/profile/ProfileViewClient';

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  return <ProfileViewClient userId={id} />;
}
