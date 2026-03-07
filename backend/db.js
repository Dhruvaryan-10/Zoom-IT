
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'zoomit',
  password: process.env.PGPASSWORD || '10October2005',
  port: process.env.PGPORT || 5432,
});

export default pool;
