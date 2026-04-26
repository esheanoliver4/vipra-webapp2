// import { redirect } from "next/navigation";
// import { getUser } from "@/lib/auth-server";
// import SettingsClient from "@/components/settings/SettingsClient";

// export default async function SettingsPage() {
//   const user = await getUser();

//   if (!user) {
//     redirect("/login");
//   }

//   return (
//     <main className="min-h-screen bg-background py-8 md:py-12">
//       <SettingsClient userId={user.id} />
//     </main>
//   );
// }

export const runtime = "nodejs";

import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth-server";
import SettingsClient from "@/components/settings/SettingsClient";

export default async function SettingsPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-background py-8 md:py-12">
      <SettingsClient userId={user.id} />
    </main>
  );
}
