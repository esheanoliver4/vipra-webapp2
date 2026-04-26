'use server';

import { createClient } from '@/lib/supabase/server';
import { getUser } from './auth';

export async function sendConnectionRequest(toUserId: string, message?: string) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

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
