'use server';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { getUserProfile } from '@/lib/auth-server';
import { revalidatePath } from 'next/cache';
import { sendApprovalEmail } from '@/lib/email-service';

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

  // Fetch user info for email
  const { data: userRecord } = await supabase
    .from('users')
    .select('email, first_name')
    .eq('id', userId)
    .single();

  if (userRecord) {
    await sendApprovalEmail(userRecord.email, userRecord.first_name, 'approved');
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

  // Fetch user info for email
  const { data: userRecord } = await supabase
    .from('users')
    .select('email, first_name')
    .eq('id', userId)
    .single();

  if (userRecord) {
    await sendApprovalEmail(userRecord.email, userRecord.first_name, 'rejected');
  }

  revalidatePath('/admin');
  return { success: true };
}

export async function deleteUser(userId: string) {
  await checkAdmin();
  
  // Use service role to manage auth deletion
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1. Get the auth_id before deleting the database record
  const { data: userRecord, error: fetchError } = await supabaseAdmin
    .from('users')
    .select('auth_id')
    .eq('id', userId)
    .single();

  if (fetchError || !userRecord) {
    return { error: 'User record not found' };
  }

  // 2. Delete from Supabase Auth
  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userRecord.auth_id);
  if (authError) {
    console.error('[v0] Auth deletion error:', authError);
    // Continue anyway to try and clean up the DB record
  }

  // 3. Delete from public.users table
  const { error: dbError } = await supabaseAdmin
    .from('users')
    .delete()
    .eq('id', userId);

  if (dbError) {
    return { error: dbError.message };
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

export async function getAdminUsers(
  page: number = 1, 
  pageSize: number = 20, 
  search?: string, 
  status?: string, 
  gender?: string
) {
  await checkAdmin();
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('users')
    .select('id, email, first_name, last_name, gender, payment_id, payment_status, approval_status, deactivated_at, created_at', { count: 'exact' });

  if (search) {
    query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  if (status && status !== 'all') {
    query = query.eq('approval_status', status);
  }

  if (gender && gender !== 'all') {
    query = query.eq('gender', gender);
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    return { error: error.message };
  }

  return { data, totalCount: count || 0 };
}

export async function getPaymentRequests() {
  await checkAdmin();
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from('PaymentRequest')
    .select(`
      *,
      users!user_id(first_name, last_name, email),
      SubscriptionPlan!plan_id(name)
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) {
    return { error: error.message };
  }

  return { data };
}

export async function approvePayment(requestId: string) {
  await checkAdmin();
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1. Get request details
  const { data: request, error: fetchError } = await supabase
    .from('PaymentRequest')
    .select('*, SubscriptionPlan!plan_id(name)')
    .eq('id', requestId)
    .single();

  if (fetchError || !request) {
    return { error: 'Payment request not found' };
  }

  // 2. Update request status
  const { error: updateRequestError } = await supabase
    .from('PaymentRequest')
    .update({ status: 'completed' })
    .eq('id', requestId);

  if (updateRequestError) return { error: updateRequestError.message };

  // 3. Update user to premium
  const { error: updateUserError } = await supabase
    .from('users')
    .update({
      is_premium: true,
      premium_plan: (request.SubscriptionPlan as any)?.name,
      premium_plan_id: request.plan_id,
      payment_status: true,
      payment_id: request.transaction_id,
      connections_sent_count: 0 // Reset count on upgrade
    })
    .eq('id', request.user_id);

  if (updateUserError) return { error: updateUserError.message };

  revalidatePath('/admin/payments');
  return { success: true };
}

export async function rejectPayment(requestId: string) {
  await checkAdmin();
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabase
    .from('PaymentRequest')
    .update({ status: 'rejected' })
    .eq('id', requestId);

  if (error) return { error: error.message };

  revalidatePath('/admin/payments');
  return { success: true };
}
