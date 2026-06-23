import pg from 'pg';

// Disable SSL authorization checking for self-signed certificates
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const { Pool } = pg;

// Initialize connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    // Required for secure Supabase cloud connection
    rejectUnauthorized: false,
  },
});

/**
 * Creates the database schema (ai_models table) if it doesn't already exist.
 */
const initializeTables = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ai_models (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      link TEXT NOT NULL,
      description TEXT NOT NULL,
      category VARCHAR(50) DEFAULT 'Other',
      icon VARCHAR(10) DEFAULT '🤖',
      color VARCHAR(20) DEFAULT '#6C63FF',
      tags TEXT[] DEFAULT '{}',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(createTableQuery);
    console.log('\x1b[36m[Postgres]\x1b[0m \x1b[32mTables initialized successfully\x1b[0m');
  } catch (error) {
    console.error('\x1b[36m[Postgres]\x1b[0m \x1b[31mTable initialization failed:\x1b[0m', error.message);
    throw error;
  }
};

/**
 * Verifies database connection and initializes the database tables.
 */
const connectDB = async () => {
  try {
    // Try to get a client from the pool to verify connection
    const client = await pool.connect();
    console.log(
      `\x1b[36m[Postgres]\x1b[0m \x1b[32mConnected successfully\x1b[0m to \x1b[33m${client.database}\x1b[0m`
    );
    client.release();
    
    // Initialize tables
    await initializeTables();
  } catch (error) {
    console.error(
      `\x1b[36m[Postgres]\x1b[0m \x1b[31mConnection failed:\x1b[0m ${error.message}`
    );
    process.exit(1);
  }
};

export { pool, connectDB };
export default connectDB;
