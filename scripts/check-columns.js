const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function checkColumns() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data, error } = await supabase.rpc('get_table_columns', { table_name: 'users' });
  
  if (error) {
    console.error('Error fetching columns via RPC:', error);
    // Try a simple select to see keys
    const { data: user, error: selectError } = await supabase.from('users').select('*').limit(1).single();
    if (selectError) {
      console.error('Error fetching sample user:', selectError);
    } else {
      console.log('Sample user keys:', Object.keys(user));
    }
  } else {
    console.log('Columns:', data);
  }
}

checkColumns();
