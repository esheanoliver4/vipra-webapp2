'use server';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { getUser } from './auth';

async function getServiceRoleClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function sendMessage(toUserId: string, content: string) {
  const user = await getUser();
  if (!user) return { error: 'Not authenticated' };

  const supabase = await getServiceRoleClient();

  // Get internal user ID
  const { data: profile } = await supabase
    .from('users')
    .select('id')
    .eq('auth_id', user.id)
    .single();

  if (!profile) return { error: 'Profile not found' };

  const { error } = await supabase
    .from('messages')
    .insert([
      {
        sender_id: profile.id,
        receiver_id: toUserId,
        content,
      },
    ]);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function getConversation(otherUserId: string) {
  const user = await getUser();
  if (!user) return { error: 'Not authenticated' };

  const supabase = await getServiceRoleClient();

  // Get internal user ID
  const { data: profile } = await supabase
    .from('users')
    .select('id')
    .eq('auth_id', user.id)
    .single();

  if (!profile) return { error: 'Profile not found' };

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(
      `and(sender_id.eq.${profile.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${profile.id})`
    )
    .order('created_at', { ascending: true });

  if (error) {
    return { error: error.message };
  }

  return { data };
}

export async function getConversations() {
  const user = await getUser();
  if (!user) return { error: 'Not authenticated' };

  const supabase = await getServiceRoleClient();

  // Get internal user ID
  const { data: profile } = await supabase
    .from('users')
    .select('id')
    .eq('auth_id', user.id)
    .single();

  if (!profile) return { error: 'Profile not found' };

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(
      `sender_id.eq.${profile.id},receiver_id.eq.${profile.id}`
    )
    .order('created_at', { ascending: false });

  if (error) {
    return { error: error.message };
  }

  // Group by conversation partner
  const conversations = new Map();
  data?.forEach((message) => {
    const partnerId = message.sender_id === profile.id ? message.receiver_id : message.sender_id;
    if (!conversations.has(partnerId)) {
      conversations.set(partnerId, message);
    }
  });

  return { data: Array.from(conversations.values()) };
}

export async function markAsRead(messageId: string) {
  const user = await getUser();
  if (!user) return { error: 'Not authenticated' };

  const supabase = await getServiceRoleClient();

  // Get internal user ID
  const { data: profile } = await supabase
    .from('users')
    .select('id')
    .eq('auth_id', user.id)
    .single();

  if (!profile) return { error: 'Profile not found' };

  const { error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('id', messageId)
    .eq('receiver_id', profile.id); // Ensure only the receiver can mark as read

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
