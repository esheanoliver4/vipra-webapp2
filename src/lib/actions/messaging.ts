'use server';

import { createClient } from '@/lib/supabase/server';
import { getUser } from './auth';

export async function sendMessage(toUserId: string, content: string) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('messages')
    .insert([
      {
        sender_id: user.id,
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
  const supabase = await createClient();
  const user = await getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(
      `and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`
    )
    .order('created_at', { ascending: true });

  if (error) {
    return { error: error.message };
  }

  return { data };
}

export async function getConversations() {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(
      `sender_id.eq.${user.id},receiver_id.eq.${user.id}`
    )
    .order('created_at', { ascending: false });

  if (error) {
    return { error: error.message };
  }

  // Group by conversation partner
  const conversations = new Map();
  data?.forEach((message) => {
    const partnerId = message.sender_id === user.id ? message.receiver_id : message.sender_id;
    if (!conversations.has(partnerId)) {
      conversations.set(partnerId, message);
    }
  });

  return { data: Array.from(conversations.values()) };
}

export async function markAsRead(messageId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('messages')
    .update({ read_at: new Date() })
    .eq('id', messageId);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
