// import BrowseClient from '@/components/browse/BrowseClient';
// import { redirect } from 'next/navigation';
// import { getUser } from '@/lib/auth-server';

// export const metadata = {
//   title: 'Browse Profiles - Viprapariwar',
//   description: 'Discover and connect with profiles from the Brahmin community'
// };

// export default async function BrowsePage() {
//   const user = await getUser();

//   if (!user) {
//     redirect('/login');
//   }

//   return (
//     <main className="min-h-screen bg-background">
//       <BrowseClient />
//     </main>
//   );
// }

export const runtime = "nodejs";

import BrowseClient from "@/components/browse/BrowseClient";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth-server";

export const metadata = {
  title: "Browse Profiles - Viprapariwar",
  description: "Discover and connect with profiles from the Brahmin community",
};

export default async function BrowsePage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-background">
      <BrowseClient />
    </main>
  );
}
