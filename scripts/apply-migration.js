// Apply migration to Supabase
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

async function applyMigration(migrationFile) {
  const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', migrationFile);
  const sql = fs.readFileSync(migrationPath, 'utf8');

  console.log(`📦 Applying migration: ${migrationFile}`);
  console.log(`📝 SQL length: ${sql.length} characters`);

  // Note: This uses the service role key to execute DDL
  // In production, you'd use Supabase CLI or dashboard
  console.log('\n⚠️  Please apply this migration manually:');
  console.log('1. Go to Supabase Dashboard → SQL Editor');
  console.log('2. Copy the contents of:', migrationPath);
  console.log('3. Run the SQL');
  console.log('\nOr use Supabase CLI:');
  console.log(`   supabase db push`);
}

applyMigration('004_market_intelligence.sql');
