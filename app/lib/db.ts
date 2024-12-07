import pg, { PoolConfig } from 'pg';
import generateUniqueUsername from './name-generator';
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
    const query: string = "SELECT email, username, about_me, profile_picture, display_name FROM dbo.user WHERE email = $1";
    const client = await dbPool.connect();
    const parameters = [email];
    const checkUserResult = await client.query(query, parameters);
    const result = checkUserResult.rows;
    client.release();
    return result;
}

export async function getUserDetailsByUsername(username: string) {
    const query: string = "SELECT email, username, about_me, profile_picture, display_name FROM dbo.user WHERE username = $1";
    const client = await dbPool.connect();
    const parameters = [username];
    const checkUserResult = await client.query(query, parameters);
    const result = checkUserResult.rows;
    client.release();
    return result;
}

export async function insertUserDetails(email: string, profilePicture: string) {
    const client = await dbPool.connect();
    const query: string = "INSERT INTO dbo.user (email, username, about_me, profile_picture, display_name) VALUES ($1, $2, $3, $4, $2)";
    const username = generateUniqueUsername(email);
    const parameters = [email, username, `Hi! I am ${username}`, profilePicture];
    const result = await client.query(query, parameters);
    client.release();
    return result.rows;
}