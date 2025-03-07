// db.ts (updated)
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Neon uses WebSockets by default <button class="citation-flag" data-index="6">
  ssl: true, // No need for rejectUnauthorized with Neon
});

export default pool;