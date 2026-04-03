import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test the connection on startup
pool
  .query('SELECT NOW()')
  .then(() => {
    console.log('Connected to PostgreSQL');
  })
  .catch((err) => {
    console.error('Failed to connect to PostgreSQL:', err.message);
    process.exit(1);
  });

export default pool;
