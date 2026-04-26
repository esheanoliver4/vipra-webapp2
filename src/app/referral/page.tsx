import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth-server';
import ReferralDashboard from '@/components/referral/ReferralDashboard';

export const metadata = {
  title: 'Refer & Earn - VipraPariwaar',
  description: 'Invite friends and earn rewards for every successful match in your network',
};

export default async function ReferralPage() {
  const user = await getUser();
  
  if (!user) {
    redirect('/login');
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-background/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <ReferralDashboard userId={user.id} />
      </div>
    </main>
  );
}
