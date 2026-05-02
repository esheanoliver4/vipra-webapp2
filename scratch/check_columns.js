const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function checkSchema() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data, error } = await supabase.rpc('get_table_columns', { table_name: 'users' });
  
  if (error) {
    // If RPC doesn't exist, try a simple select
    const { data: selectData, error: selectError } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (selectError) {
      console.error('Error fetching data:', selectError);
      return;
    }
    
    if (selectData && selectData.length > 0) {
      console.log('Columns found in users table:');
      console.log(Object.keys(selectData[0]).sort().join(', '));
    } else {
      console.log('Table is empty, could not determine columns via SELECT.');
    }
  } else {
    console.log('Columns:', data);
  }
}

checkSchema();
