'use server';

import { createClient } from '@/lib/supabase/server';
import { getUserProfile } from '@/lib/auth-server';
import { revalidatePath } from 'next/cache';

async function checkAdmin() {
  const profile = await getUserProfile();
  if (profile?.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required');
  }
}

export async function verifyUser(userId: string) {
  await checkAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from('users')
    .update({ is_verified: true })
    .eq('id', userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin');
  return { success: true };
}

export async function makeUserPremium(userId: string) {
  await checkAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from('users')
    .update({ is_premium: true, premium_plan: 'gold' })
    .eq('id', userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin');
  return { success: true };
}

export async function getAdminStats() {
  await checkAdmin();
  const supabase = await createClient();

  // Get total users
  const { count: totalUsers, error: countError } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });

  if (countError) throw countError;

  // Get verified users
  const { count: verifiedProfiles } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('is_verified', true);

  // Get premium users
  const { count: premiumMembers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('is_premium', true);

  // For "Active Today", we should ideally check a sessions table or last_sign_in_at
  // Since we don't have a sessions table in the schema, we'll use a more realistic (though still imperfect)
  // metric like users created or updated today, or just return 0 if we can't track it properly.
  // But to be "correct", let's try to query last_sign_in_at if it exists in auth.users (which we can't easily query from public.users)
  // So let's just use 0 for now or a real query if possible.
  
  return {
    totalUsers: totalUsers || 0,
    verifiedProfiles: verifiedProfiles || 0,
    premiumMembers: premiumMembers || 0,
    activeToday: 0, // Placeholder for real activity tracking
  };
}
