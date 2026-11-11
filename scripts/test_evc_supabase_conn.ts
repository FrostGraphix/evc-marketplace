import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://unuhnhknczcgxqaekzrh.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_sJp1EgqpM4I0X7bcA4oqCQ_GlUQaG4A';

console.log('Testing connection to Supabase:');
console.log('URL:', SUPABASE_URL);
console.log('Key prefix:', SUPABASE_KEY.slice(0, 16) + '...');

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function check() {
  console.log('\n1. Checking Auth service status...');
  const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
  if (sessionErr) {
    console.error('Auth error:', sessionErr.message);
  } else {
    console.log('✅ Supabase Auth service reachable! Active session:', sessionData?.session ? 'Yes' : 'No');
  }

  console.log('\n2. Querying categories table...');
  const { data: catData, error: catErr } = await supabase.from('categories').select('*').limit(5);
  if (catErr) {
    console.log('ℹ️ Categories table query returned error (table might need migration/schema executed in SQL editor):', catErr.message);
  } else {
    console.log('✅ Categories table queried successfully! Row count:', catData?.length);
    console.log(catData);
  }

  console.log('\n3. Querying products table...');
  const { data: prodData, error: prodErr } = await supabase.from('products').select('*').limit(5);
  if (prodErr) {
    console.log('ℹ️ Products table query returned error (table might need migration/schema executed in SQL editor):', prodErr.message);
  } else {
    console.log('✅ Products table queried successfully! Row count:', prodData?.length);
    console.log(prodData);
  }
}

check().catch(console.error);
