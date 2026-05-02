import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/auth-server";
import SubscriptionClient from "@/components/subscription/SubscriptionClient";

export const metadata = {
  title: 'Subscription - VipraPariwar',
  description: 'Manage your subscription and premium features'
};

export default async function SubscriptionPage() {
  const user = await getUserProfile();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-background py-8 md:py-12">
      <SubscriptionClient user={user} />
    </main>
  );
}
