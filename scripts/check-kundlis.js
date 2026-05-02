const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function checkKundlis() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data: kundli, error: selectError } = await supabase.from('kundlis').select('*').limit(1).single();
  if (selectError) {
    console.error('Error fetching sample kundli:', selectError);
  } else {
    console.log('Sample kundli keys:', Object.keys(kundli));
  }
}

checkKundlis();
