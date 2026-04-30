import mysql from 'mysql2/promise'

export const connectionConfig = {
  host: process.env.DB_HOST ?? 'localhost',
  user: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? 'StreamingDB_Identity',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}

export const pool = mysql.createPool(connectionConfig)
