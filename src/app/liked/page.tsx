import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth-server';
import LikedClient from '@/components/liked/LikedClient';

export default async function LikedPage() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  return <LikedClient />;
}
