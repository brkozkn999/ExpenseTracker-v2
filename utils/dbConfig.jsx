import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema'

const sql = neon("postgresql://moneydb_owner:ySLAKY1DI8wB@ep-dry-moon-a5wpehsh.us-east-2.aws.neon.tech/Expenses-Tracker?sslmode=require");
const db = drizzle(sql, {schema});

export { db };