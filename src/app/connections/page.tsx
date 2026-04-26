import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth-server';
import ConnectionsClient from '@/components/connections/ConnectionsClient';

export default async function ConnectionsPage() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  return <ConnectionsClient />;
}
