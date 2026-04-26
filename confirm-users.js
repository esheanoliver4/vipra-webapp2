const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function confirmAllUsers() {
  console.log('Fetching users...');
  const { data: { users }, error } = await supabase.auth.admin.listUsers();
  
  if (error) {
    console.error('Error fetching users:', error);
    return;
  }

  console.log(`Found ${users.length} users. Confirming them now...`);

  for (const user of users) {
    if (!user.email_confirmed_at) {
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        user.id,
        { email_confirm: true }
      );
      
      if (updateError) {
        console.error(`Failed to confirm ${user.email}:`, updateError.message);
      } else {
        console.log(`✅ Confirmed: ${user.email}`);
      }
    } else {
      console.log(`ℹ️ Already confirmed: ${user.email}`);
    }
  }
  console.log('Done!');
}

confirmAllUsers();
