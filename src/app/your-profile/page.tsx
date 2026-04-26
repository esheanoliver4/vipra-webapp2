import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth-server';
import YourProfileClient from '@/components/profile/YourProfileClient';

export const metadata = {
  title: 'My Profile | VipraPariwaar',
  description: 'View and manage your matrimony profile',
};

export default async function YourProfilePage() {
  const user = await getUser();
  
  if (!user) {
    redirect('/login');
  }

  return (
    <main className="min-h-screen bg-background py-8 md:py-12">
      <YourProfileClient userId={user.id} />
    </main>
  );
}
