import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth-server';
import MessagesClient from '@/components/messages/MessagesClient';

export default async function MessagesPage() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  return <MessagesClient />;
}
