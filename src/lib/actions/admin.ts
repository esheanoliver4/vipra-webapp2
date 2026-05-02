'use server';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { getUserProfile } from '@/lib/auth-server';
import { revalidatePath } from 'next/cache';

async function checkAdmin() {
  const profile = await getUserProfile();
  if (profile?.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required');
  }
}

export async function deactivateUser(userId: string) {
  await checkAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from('users')
    .update({ 
      approval_status: 'rejected',
      is_approved: false,
      deactivated_at: new Date().toISOString()
    })
    .eq('id', userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin');
  return { success: true };
}

export async function approveUser(userId: string) {
  await checkAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from('users')
    .update({ 
      approval_status: 'approved',
      is_approved: true,
      approved_at: new Date().toISOString()
    })
    .eq('id', userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin');
  return { success: true };
}

export async function rejectUser(userId: string) {
  await checkAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from('users')
    .update({ 
      approval_status: 'rejected',
      is_approved: false
    })
    .eq('id', userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin');
  return { success: true };
}

export async function deleteUser(userId: string) {
  await checkAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin');
  return { success: true };
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

export async function getAdminUserDetail(userId: string) {
  await checkAdmin();
  // Use service role client for admin detail to bypass RLS and ensure related data is fetched
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch user data with kundli and family members joined
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*, kundlis(*), FamilyMember(*)')
    .eq('id', userId)
    .single();

  if (userError) {
    return { error: userError.message };
  }

  // Get the first kundli record if it exists
  const kundli = Array.isArray(userData.kundlis) ? userData.kundlis[0] : userData.kundlis;

  // Merge data for the frontend
  const combinedData = {
    ...userData,
    // Exhaustive mapping for birth details and cultural info
    place_of_birth: kundli?.birth_place || userData.place_of_birth || userData.location_city || '',
    time_of_birth: kundli?.birth_time || userData.time_of_birth || kundli?.time_of_birth || '',
    gotra: kundli?.gotra || userData.gotra || '',
    // Handle the date_of_birth vs dob naming
    dob: userData.date_of_birth || userData.dob || kundli?.birth_date || '',
  };

  return { data: combinedData };
}

export async function getAdminStats() {
  await checkAdmin();
  const supabase = await createClient();

  // Get total users
  const { count: totalUsers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });

  // Get pending users
  const { count: pendingUsers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('approval_status', 'pending');

  // Get accepted/approved users
  const { count: acceptedUsers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('approval_status', 'approved');

  // Get rejected users
  const { count: rejectedUsers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('approval_status', 'rejected');
  
  return {
    totalUsers: totalUsers || 0,
    pendingUsers: pendingUsers || 0,
    acceptedUsers: acceptedUsers || 0,
    rejectedUsers: rejectedUsers || 0,
  };
}
