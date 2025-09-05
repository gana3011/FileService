import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const {Pool} = pg;


export const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

(async () => {
  try {
    const client = await pool.connect();
    console.log("PostgreSQL Connected!");
    client.release();
  } catch (err) {
    console.error("Database Connection Error:", err);
  }
})();

// Gracefully close the pool on app exit
process.on("exit", async () => {
  await pool.end();
  console.log("PostgreSQL pool closed.");
});