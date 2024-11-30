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
    connectionTimeoutMillis: 4000,
    ssl: {
        rejectUnauthorized: true,
        ca: process.env.DB_CA_CERT
    }
}

export const dbPool = new Pool(config);

export async function getUserDetails(email: string) {
    const query: string = "SELECT email, username, about_me, verification FROM dbo.user WHERE email = $1";
    const client = await dbPool.connect();
    const parameters: string[] = [email];
    const result = await client.query(query, parameters);
    console.log(result.rows);
    client.release();
}