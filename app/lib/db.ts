import pg, { PoolConfig } from 'pg';
import generateUniqueUsername from './name-generator';
import { UserDetails } from '../(root)/models/api';
import fs from 'fs';
import { VALID_GUID } from './constants';
import { PostInfo } from '../components/EditPostForm';
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
        ca: fs.readFileSync("./db_cacert.cer")
    }
}

export const dbPool = new Pool(config);

export async function getUserDetails(email: string) {
    const query: string = "SELECT username, about_me, profile_picture, display_name FROM dbo.user WHERE email = $1";
    const client = await dbPool.connect();
    const parameters = [email];
    const checkUserResult = await client.query(query, parameters);
    const result = checkUserResult.rows;
    client.release();
    return result;
}

export async function getUserDetailsByUsername(username: string) {
    const query: string = "SELECT username, about_me, profile_picture, display_name FROM dbo.user WHERE username = $1";
    const client = await dbPool.connect();
    const parameters = [username];
    const checkUserResult = await client.query(query, parameters);
    const result: UserDetails[] = checkUserResult.rows;
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

export async function editUserDetails(username: string, newUsername: string, displayName: string, aboutMe: string) {
    const client = await dbPool.connect();
    const query: string = "UPDATE dbo.user SET username = $1, display_name = $2, about_me = $3 WHERE username = $4";
    const result = await client.query(query, [newUsername, displayName, aboutMe, username]);
    // console.log(result);
    client.release();
    return result.rows;
}

export const MAX_DATE = new Date(9999, 11, 31);

// export async function getAllPostsByEmail(email: string, startTimeFilter: Date, endTimeFilter: Date, offset: number) {

// }

// export async function getPostsByUsername(username: string, startTimeFilter: Date, endTimeFilter: Date, offset: number) {

// }

export async function getPostsShort(startTimeFilter: Date, endTimeFilter: Date, offset: number) {
    const client = await dbPool.connect();
    const query: string = "SELECT id, title, description, start_time, end_time, location, last_updated_at, last_updated_by, created_by FROM dbo.meetup WHERE start_time BETWEEN $1 AND $2 ORDER BY start_time DESC OFFSET $3";
    const result = await client.query(query, [startTimeFilter.toISOString(), endTimeFilter.toISOString(), offset]);
    // console.log(result);
    client.release();
    return result.rows
}

export async function getPostFull(id: string) {
    if (!VALID_GUID.test(id)) {
        return null;
    }
    const client = await dbPool.connect();
    const query: string = "SELECT id, title, description, start_time, end_time, location, last_updated_at, last_updated_by, created_by FROM dbo.meetup WHERE id = $1";
    const result = await client.query(query, [id]);
    // console.log(result);
    client.release();
    if (result.rows.length === 0) {
        return null;
    }
    return result.rows[0]
}

export async function createNewPost(post: PostInfo) {
    try {
        const client = await dbPool.connect();
        const query: string = "INSERT INTO dbo.meetup (title, description, start_time, end_time, location, last_updated_at, last_updated_by, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)";
        await client.query(query, [post.title, post.description, post.start_time, post.end_time, post.location, post.last_updated_at, post.last_updated_by, post.created_by]);
        client.release();
        return "Success: Created new post.";
    } catch (error) {
        console.log(`Error in DB utils createNewPost: ${error}`);
        return "Error: Unable to create new post in db utils.";
    }
}

// export async function updatePost(post: PostInfo) {

// }

// export async function deletePost(id: string) {
    
// }