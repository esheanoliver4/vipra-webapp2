'use server';

import { createClient } from '@/lib/supabase/server';
import { getUser } from './auth';

export async function sendConnectionRequest(toUserId: string, message?: string) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  // Use service role for limit check and increment
  const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
  const serviceRoleClient = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1. Get user profile and their plan's limit
  const { data: userProfile, error: profileError } = await serviceRoleClient
    .from('users')
    .select('*, SubscriptionPlan!premium_plan_id(connection_limit)')
    .eq('auth_id', user.id)
    .single();

  if (profileError || !userProfile) {
    return { error: 'Profile not found' };
  }

  const limit = (userProfile.SubscriptionPlan as any)?.connection_limit || 5;
  const currentCount = userProfile.connections_sent_count || 0;

  if (currentCount >= limit) {
    return { error: `You have reached your limit of ${limit} connection requests. Please upgrade your plan to send more.` };
  }

  // 2. Insert connection
  const { error } = await supabase
    .from('connections')
    .insert([
      {
        from_user_id: user.id,
        to_user_id: toUserId,
        message,
        status: 'pending',
      },
    ]);

  if (error) {
    return { error: error.message };
  }

  // 3. Increment the count
  await serviceRoleClient
    .from('users')
    .update({ connections_sent_count: currentCount + 1 })
    .eq('id', userProfile.id);

  return { success: true };
}

export async function acceptConnection(connectionId: string) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('connections')
    .update({ status: 'accepted' })
    .eq('id', connectionId)
    .eq('to_user_id', user.id);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function rejectConnection(connectionId: string) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('connections')
    .update({ status: 'rejected' })
    .eq('id', connectionId)
    .eq('to_user_id', user.id);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function getConnections() {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { data, error } = await supabase
    .from('connections')
    .select('*')
    .or(
      `from_user_id.eq.${user.id},to_user_id.eq.${user.id}`
    )
    .eq('status', 'accepted');

  if (error) {
    return { error: error.message };
  }

  return { data };
}

export async function getPendingRequests() {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { data, error } = await supabase
    .from('connections')
    .select('*')
    .eq('to_user_id', user.id)
    .eq('status', 'pending');

  if (error) {
    return { error: error.message };
  }

  return { data };
}

export async function getSentRequests() {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { data, error } = await supabase
    .from('connections')
    .select('*')
    .eq('from_user_id', user.id)
    .eq('status', 'pending');

  if (error) {
    return { error: error.message };
  }

  return { data };
}
