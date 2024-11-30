import pg, { PoolConfig } from 'pg';
const { Pool } = pg;

const config: PoolConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT || "not available"),
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    ssl: {
        rejectUnauthorized: true,
        ca: process.env.DB_CA_CERT
    }
}

export const dbPool = new Pool(config);