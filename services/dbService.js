import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export async function runSQL(sql, table) {
  if (!sql || !table) {
    throw new Error("Both SQL query and table name are required");
  }

  // Validate table name format (basic check)
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(table)) {
    throw new Error("Invalid table name format");
  }

  // Convert to lowercase for case-insensitive check
  const lowerSQL = sql.toLowerCase().trim();
  const lowerTable = table.toLowerCase();

  // Check if SQL contains the specified table (with word boundaries)
  // This pattern matches:
  // - from table_name
  // - from "table_name"
  // - from 'table_name'
  // - join table_name
  // - join "table_name"
  // - join 'table_name'
  // etc.
  const tableReferencePattern = new RegExp(
    `(from|join|update|into)\\s+["']?${lowerTable}["']?\\b`, 
    'i'
  );
  
  if (!tableReferencePattern.test(lowerSQL)) {
    throw new Error(`SQL must reference only the specified table: ${table}`);
  }

  try {
    // Execute the raw SQL query using Supabase
    const { data, error } = await supabase.rpc('run_raw_sql', { query: sql });

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(`SQL execution error: ${error.message}`);
  }
}