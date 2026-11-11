import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { Client } = pg;

// Read password from environment
const dbPassword = process.env.SUPABASE_DB_PASSWORD || process.env.DATABASE_PASSWORD || '';
const hosts = [
  'db.unuhnhknczcgxqaekzrh.supabase.co',
  'aws-0-eu-central-1.pooler.supabase.com',
  'aws-1-eu-central-1.pooler.supabase.com',
  'aws-0-us-east-1.pooler.supabase.com',
  'aws-0-eu-west-1.pooler.supabase.com'
];

async function tryConnect(host, user, port = 5432) {
  console.log(`Connecting to ${host}:${port} as ${user}...`);
  const client = new Client({
    host,
    port,
    user,
    password: dbPassword,
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    await client.connect();
    console.log(`✅ Successfully connected to ${host}!`);
    return client;
  } catch (err) {
    console.warn(`Connection failed on ${host}: ${err.message}`);
    return null;
  }
}

async function main() {
  let client = await tryConnect('db.unuhnhknczcgxqaekzrh.supabase.co', 'postgres', 5432);

  if (!client) {
    // Try pooler with postgres.unuhnhknczcgxqaekzrh
    for (const h of hosts.slice(1)) {
      client = await tryConnect(h, 'postgres.unuhnhknczcgxqaekzrh', 6543);
      if (client) break;
      client = await tryConnect(h, 'postgres.unuhnhknczcgxqaekzrh', 5432);
      if (client) break;
    }
  }

  if (!client) {
    console.error('❌ Could not connect to any database endpoint directly.');
    process.exit(1);
  }

  console.log('Reading supabase/full_evc_setup.sql...');
  const sql = fs.readFileSync(path.join(process.cwd(), 'supabase', 'full_evc_setup.sql'), 'utf8');

  console.log('Executing schema and seed SQL on remote Supabase database...');
  await client.query(sql);
  console.log('🎉 SCHEMA & SEED SUCCESSFULLY APPLIED TO LIVE DATABASE!');

  // Verify rows
  const catRes = await client.query('SELECT count(*) FROM public.categories;');
  const prodRes = await client.query('SELECT count(*) FROM public.products;');
  console.log(`Categories count: ${catRes.rows[0].count}`);
  console.log(`Products count: ${prodRes.rows[0].count}`);

  await client.end();
}

main().catch(err => {
  console.error('Migration error:', err);
  process.exit(1);
});
