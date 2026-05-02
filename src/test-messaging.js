require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const user1 = 'afea5ca2-2737-4c8a-879f-9233093b2f19'; // Admin
const user2 = 'eb5b1ea6-63ff-44d0-96fa-1476c55e3fad'; // Prahalad

async function testMessaging() {
  console.log('--- Testing Messaging System ---');

  // 1. Send message from User 1 to User 2
  console.log(`Sending message from ${user1} to ${user2}...`);
  const { error: sendError } = await supabase
    .from('messages')
    .insert([
      {
        sender_id: user1,
        receiver_id: user2,
        content: 'Hello from automated test! ' + new Date().toISOString(),
      },
    ]);

  if (sendError) {
    console.error('Send Error:', sendError);
    return;
  }
  console.log('Message sent successfully!');

  // 2. Fetch conversation for User 2
  console.log(`Fetching conversation for ${user2}...`);
  const { data: convData, error: convError } = await supabase
    .from('messages')
    .select('*')
    .or(`and(sender_id.eq.${user1},receiver_id.eq.${user2}),and(sender_id.eq.${user2},receiver_id.eq.${user1})`)
    .order('created_at', { ascending: true });

  if (convError) {
    console.error('Fetch Error:', convError);
    return;
  }
  console.log(`Found ${convData.length} messages in conversation.`);
  console.log('Latest message:', convData[convData.length - 1].content);

  // 3. Mark last message as read
  const lastMessageId = convData[convData.length - 1].id;
  console.log(`Marking message ${lastMessageId} as read...`);
  const { error: readError } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('id', lastMessageId);

  if (readError) {
    console.error('Read Update Error:', readError);
    return;
  }
  console.log('Message marked as read successfully!');

  console.log('--- Test Complete: SUCCESS ---');
}

testMessaging();
