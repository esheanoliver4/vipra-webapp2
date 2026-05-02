const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function checkSchema() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data: selectData, error: selectError } = await supabase
    .from('kundlis')
    .select('*')
    .limit(1);
  
  if (selectError) {
    console.error('Error fetching data:', selectError);
    return;
  }
  
  if (selectData && selectData.length > 0) {
    console.log('Columns found in kundlis table:');
    console.log(Object.keys(selectData[0]).sort().join(', '));
  } else {
    console.log('Kundlis table is empty.');
  }
}

checkSchema();
