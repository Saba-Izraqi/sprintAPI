import { Client } from "pg";

const DEFAULT_DB = "postgres";

interface IDatabaseConfig {
  dbName: string;
  user: string;
  password: string;
  host?: string;
  port?: number;
}

export const ensureDatabaseExists = async ({
  dbName,
  user,
  password,
  host = "localhost",
  port = 5432,
}: IDatabaseConfig) => {
  const client = new Client({
    user,
    password,
    host,
    port,
    database: DEFAULT_DB,
  });

  try {
    await client.connect();

    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (res.rowCount === 0) {
      console.warn(`📦 Database "${dbName}" not found. Creating...`);
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.success(`✅ Database "${dbName}" created.`);
    } else {
      console.info(`✅ Database "${dbName}" already exists.`);
    }
  } catch (err) {
    console.error(`❌ Failed to check/create database "${dbName}"`, err);
    throw err;
  } finally {
    await client.end();
  }
};

