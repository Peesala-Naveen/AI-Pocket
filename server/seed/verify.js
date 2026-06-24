import dotenv from 'dotenv';
dotenv.config({ path: 'c:/Users/siddh/OneDrive/Desktop/AI Pocket/server/.env' });
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function check() {
  try {
    const res = await pool.query('SELECT COUNT(*) FROM ai_models');
    console.log('Verification Success: Total items in database is', res.rows[0].count);
    const sample = await pool.query('SELECT name, category FROM ai_models LIMIT 5');
    console.log('Database sample:');
    sample.rows.forEach(r => console.log(` - ${r.name} (${r.category})`));
  } catch (err) {
    console.error('Verification Error:', err.message);
  } finally {
    await pool.end();
  }
}

check();
