import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export async function runSQL(sql) {
  const { data, error } = await supabase.rpc('run_raw_sql', { query: sql }); // Assumes you created a stored procedure
  if (error) throw new Error(error.message);
  return data;
}
