import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const envFile = fs.readFileSync('.env.local', 'utf-8');
const VITE_SUPABASE_URL = envFile.split('\n').find(line => line.startsWith('VITE_SUPABASE_URL')).split('=')[1].trim();
const VITE_SUPABASE_ANON_KEY = envFile.split('\n').find(line => line.startsWith('VITE_SUPABASE_ANON_KEY')).split('=')[1].trim();

const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);

async function run() {
  const { data, error } = await supabase.rpc('get_next_sequence', { doc_type: 'FT', comp_id: '123' });
  console.log('RPC check:', error?.message || 'Success');
  
  // also get the first company so I can test clients
  const { data: companies } = await supabase.from('companies').select('*').limit(1);
  console.log('Company:', companies?.[0]?.id);
}
run();
