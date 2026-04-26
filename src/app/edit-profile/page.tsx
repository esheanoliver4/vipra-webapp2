import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth-server';
import EditProfileClient from '@/components/profile/EditProfileClient';

export const metadata = {
  title: 'Edit Profile - Viprapariwar',
  description: 'Update your profile information'
};

export default async function EditProfilePage() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  return <EditProfileClient />;
}
