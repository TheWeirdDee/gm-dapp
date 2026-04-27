import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.log('❌ ERROR: Missing Supabase URL or Service Key in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function diagnostic() {
  console.log('--- DB DIAGNOSTIC ---');
  console.log('URL:', supabaseUrl);
  
  // 1. Check profiles table
  console.log('\nChecking "profiles" table...');
  const { data: profiles, error: pError } = await supabase.from('profiles').select('*').limit(1);
  if (pError) console.log('❌ Profiles Table error:', pError.message, '(' + pError.code + ')');
  else console.log('✅ Profiles Table exists.');

  // 2. Check auth_nonces table
  console.log('\nChecking "auth_nonces" table...');
  const { data: nonces, error: nError } = await supabase.from('auth_nonces').select('*').limit(1);
  if (nError) console.log('❌ Auth Nonces Table error:', nError.message, '(' + nError.code + ')');
  else console.log('✅ Auth Nonces Table exists.');

  // 3. Check get_algorithmic_feed function
  console.log('\nChecking "get_algorithmic_feed" function...');
  const { data: feed, error: fError } = await supabase.rpc('get_algorithmic_feed', { 
    viewer_address: 'anonymous', 
    post_limit: 1, 
    post_cursor: new Date().toISOString() 
  });
  if (fError) console.log('❌ Algorithmic Feed Function error:', fError.message, '(' + fError.code + ')');
  else console.log('✅ Algorithmic Feed Function exists.');
}

diagnostic();
