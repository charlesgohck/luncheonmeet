import pg, { PoolConfig } from 'pg';
import generateUniqueUsername from './name-generator';
import { UserDetails } from '../(root)/models/api';
import { VALID_GUID } from './constants';
import { MeetupRoomParticipant as MeetupRoomParticipant, PostInfo } from '../components/EditPostForm';
import { InsertMeetupRoomParticipant } from '../components/JoinMeetButton';
import { MeetingRoomMessage } from '../components/ChatComponent';
const { Pool } = pg;

console.log(process.env.POSTGRES_CA_CERT);

const config: PoolConfig = {
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    port: parseInt(process.env.POSTGRES_PORT || "not available"),
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    idle_in_transaction_session_timeout: 20000,
    ssl: {
        rejectUnauthorized: true,
        ca: process.env.POSTGRES_CA_CERT,
    }
}

export const dbPool = new Pool(config);

export async function getUserDetails(email: string) {
    const client = await dbPool.connect();
    try {
        const query: string = "SELECT username, about_me, profile_picture, display_name, email FROM dbo.user WHERE email = $1";
        const parameters = [email];
        const checkUserResult = await client.query(query, parameters);
        const result = checkUserResult.rows;
        client.release();
        return result;
    } catch (error) {
        console.log(`Error: getUserDetails received error: ${error}`);
        client.release();
        return [];
    }
}

export async function getUserDetailsByUsername(username: string) {
    const client = await dbPool.connect();
    try {
        const query: string = "SELECT username, about_me, profile_picture, display_name FROM dbo.user WHERE username = $1";
        const parameters = [username];
        const checkUserResult = await client.query(query, parameters);
        const result: UserDetails[] = checkUserResult.rows;
        client.release();
        return result;
    } catch (error) {
        console.log(`Error: getUserDetailsByUsername error: ${error}`);
        client.release();
        return null;
    }
}

export async function insertUserDetails(email: string, profilePicture: string) {
    const client = await dbPool.connect();
    try {
        const query: string = "INSERT INTO dbo.user (email, username, about_me, profile_picture, display_name) VALUES ($1, $2, $3, $4, $2)";
        const username = generateUniqueUsername(email);
        const parameters = [email, username, `Hi! I am ${username}`, profilePicture];
        const result = await client.query(query, parameters);
        client.release();
        return result.rows;
    } catch (error) {
        console.log(`Error: insertUserDetails error: ${error}`);
        client.release();
        return null;
    }
}

export async function editUserDetails(username: string, newUsername: string, displayName: string, aboutMe: string) {
    const client = await dbPool.connect();
    try {
        const query: string = "UPDATE dbo.user SET username = $1, display_name = $2, about_me = $3 WHERE username = $4";
        const result = await client.query(query, [newUsername, displayName, aboutMe, username]);
        // console.log(result);
        client.release();
        return result.rows;
    } catch (error) {
        console.log(`Error: editUserDetails error: ${error}`);
        client.release();
        return null;
    }
}

export async function updateUserProfilePicture(email: string, imageUrl: string) {
    const client = await dbPool.connect();
    try {
        const query: string = "UPDATE dbo.user SET profile_picture = $1 WHERE email = $2";
        const result = await client.query(query, [imageUrl, email]);
        // console.log(result);
        client.release();
        return result.rows;
    } catch (error) {
        console.log(`Error: updateUserProfilePicture error: ${error}`);
        client.release();
        return null;
    }
}


export const MAX_DATE = new Date(9999, 11, 31);

export async function getPostsShort(startTimeFilter: Date, endTimeFilter: Date, offset: number) {
    const client = await dbPool.connect();
    try {
        const query: string = "SELECT id, title, description, start_time, end_time, location, last_updated_at, last_updated_by, created_by, max_participants FROM dbo.meetup WHERE start_time BETWEEN $1 AND $2 ORDER BY start_time DESC OFFSET $3";
        const result = await client.query(query, [startTimeFilter.toISOString(), endTimeFilter.toISOString(), offset]);
        // console.log(result);
        client.release();
        return result.rows
    } catch (error) {
        client.release();
        console.log(`Error: getPostsShort error: ${error}`);
        return [];
    }
}

export async function getPostFull(id: string) {
    const client = await dbPool.connect();
    try {
        if (!VALID_GUID.test(id)) {
            return null;
        }
        const query: string = "SELECT id, title, description, start_time, end_time, location, last_updated_at, last_updated_by, created_by, max_participants FROM dbo.meetup WHERE id = $1";
        const result = await client.query(query, [id]);
        // console.log(result);
        if (result.rows.length === 0) {
            return null;
        }
        client.release();
        return result.rows[0]
    } catch (error) {
        console.log(`Error: Unable to getPostFull for ${id} with error: ${error}`);
        client.release();
        return null
    }
}

export async function createNewPost(post: PostInfo): Promise<string> {
    const client = await dbPool.connect();
    try {
        client.query("BEGIN");
        const query: string = "INSERT INTO dbo.meetup (id, title, description, start_time, end_time, location, last_updated_at, last_updated_by, created_by, max_participants) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)";
        await client.query(query, [post.id, post.title, post.description, post.start_time, post.end_time, post.location, post.last_updated_at, post.last_updated_by, post.created_by, post.max_participants]);
        const queryToAddParticipant: string = "INSERT INTO dbo.meetup_room_participant (email, meet_id, joined_at) VALUES ($1, $2, $3)";
        await client.query(queryToAddParticipant, [post.created_by, post.id, post.last_updated_at]);
        client.query("COMMIT");
        client.release();
        return "Success: Created new post and added creator as participant.";
    } catch (error) {
        console.log(`Error in DB utils createNewPost: ${error}`);
        client.query("ROLLBACK");
        client.release();
        return "Error: Internal server error. Unable to add new post.";
    }
}

export async function updatePost(post: PostInfo): Promise<string> {
    const client = await dbPool.connect();
    try {
        const query: string = "UPDATE dbo.meetup SET title = $1, description = $2, start_time = $3, end_time = $4, location = $5, last_updated_at = $6, last_updated_by = $7, created_by = $8, max_participants = $9 WHERE id = $10";
        await client.query(query, [post.title, post.description, post.start_time, post.end_time, post.location, post.last_updated_at, post.last_updated_by, post.created_by, post.max_participants, post.id]);
        client.release();
        return `Success: Updated post ${post.id}.`;
    } catch (error) {
        client.release();
        console.log(`Error in DB utils updatePost: ${error}`);
        return "Error: Internal server error. Unable to edit post.";
    }
}

export async function deletePost(post: PostInfo) {
    const client = await dbPool.connect();
    try {
        await client.query("BEGIN");
        const addToArchiveTableQuery: string = "INSERT INTO dbo.meetup_archive (id, title, description, start_time, end_time, location, last_updated_at, last_updated_by, created_by, max_participants) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)"
        // Step 1: Send entry to archive
        console.log(`Sending entry to archive: ${post.id}`);
        await client.query(addToArchiveTableQuery, [post.id, post.title, post.description, post.start_time, post.end_time, post.location, post.last_updated_at, post.last_updated_by, post.created_by, post.max_participants]);
        // Step 2: Delete entry from main table
        console.log(`Deleting entry: ${post.id}`);
        const deletePostFromMainTableQuery: string = "DELETE FROM dbo.meetup WHERE id = $1";
        await client.query(deletePostFromMainTableQuery, [post.id]);
        // Step 3: Commit and Return success message
        console.log(`Commiting archive and deletion: ${post.id}`);
        await client.query("COMMIT");
        client.release();
        return `Success: Delete Post operation successful for ${post.id}`;
    } catch (error) {
        // Log message and return generic error to the frontend
        console.log(`Unknown error occurred: ${error}. Rolling back.`);
        await client.query("ROLLBACK");
        client.release();
        return `Error: Unknown error occurred when attempting to delete post with id ${post.id}`;
    }
}

export async function getParticipantsForMeet(meetId: string): Promise<Array<MeetupRoomParticipant>> {
    const client = await dbPool.connect();
    try {
        const query: string = "SELECT id, p.email as email, meet_id, joined_at, has_left, profile_picture, username FROM dbo.meetup_room_participant p LEFT JOIN dbo.user u ON p.email = u.email WHERE meet_id = $1";
        const result = await client.query(query, [meetId]);
        client.release();
        return result.rows
    } catch (error) {
        console.log(`Error in getParticipantsForMeet: ${error}`);
        client.release();
        return [];
    }
}

export async function insertParticipantForMeet(meetupRoomParticipant: InsertMeetupRoomParticipant) {
    const client = await dbPool.connect();
    try {
        const queryToCheckIfParticipantsExists: string = "SELECT id, email, meet_id, joined_at, has_left FROM dbo.meetup_room_participant WHERE meet_id = $1 and email = $2";
        const result = await client.query(queryToCheckIfParticipantsExists, [meetupRoomParticipant.meetId, meetupRoomParticipant.email]);
        if (result.rows.length > 0) {
            console.log(`User ${meetupRoomParticipant.email} already exists. Aborting...`);
            client.release();
            return null
        } else {
            console.log(`User ${meetupRoomParticipant.email} does not exists. Proceed to insert participant.`);
        }
        const query: string = "INSERT INTO dbo.meetup_room_participant (email, meet_id, joined_at) VALUES ($1, $2, $3)";
        await client.query(query, [meetupRoomParticipant.email, meetupRoomParticipant.meetId, meetupRoomParticipant.joined_at]);
        const successMessage: string = `Success: Added ${meetupRoomParticipant.email} to meet ${meetupRoomParticipant.meetId}`;
        console.log(successMessage);
        client.release();
        return successMessage;
    } catch (error) {
        console.log(`Error in insertParticipantForMeet: ${error}`);
        client.release();
        return `Error: Error in insertParticipantForMeet for ${meetupRoomParticipant.email} for meet id ${meetupRoomParticipant.meetId}`;
    }
}

export async function deleteParticipantForMeet(email: string, meetId: string) {
    const client = await dbPool.connect();
    try {
        const queryToCheckIfParticipantsExists: string = "SELECT id, email, meet_id, joined_at, has_left FROM dbo.meetup_room_participant WHERE meet_id = $1 and email = $2";
        const result = await client.query(queryToCheckIfParticipantsExists, [meetId, email]);
        if (result.rows.length === 0) {
            console.log(`User ${email} does not exists. Aborting...`);
            client.release();
            return "Error: User does not exist."
        } else {
            console.log(`User ${email} exists. Proceed to delete participant.`);
        }
        const query: string = "DELETE FROM dbo.meetup_room_participant WHERE meet_id = $1 AND email = $2";
        await client.query(query, [meetId, email]);
        const successMessage: string = `Success: ${email} left from meetup ${meetId}`;
        console.log(successMessage);
        client.release();
        return successMessage;
    } catch (error) {
        console.log(`Error in deleteParticipantForMeet: ${error}`);
        client.release();
        return `Error: Error in deleteParticipantForMeet for ${email} for meet id: ${meetId}`;
    }
}

export async function insertNewMessageForChatRoom(meetingRoomMessage: MeetingRoomMessage) {
    const client = await dbPool.connect();
    try {
        const query: string = "INSERT INTO dbo.message (meeting_room_id, text, sender_username, sender_email, timestamp) VALUES ($1, $2, $3, $4, NOW())";
        const result = await client.query(query, [meetingRoomMessage.meetingRoomId, meetingRoomMessage.text, meetingRoomMessage.senderUsername, meetingRoomMessage.senderEmail]);
        console.log(`${result.rowCount} rows affected`);
        client.release();
        return result;
    } catch (error) {
        console.log(`Error in insertNewMessageForChatRoom: ${error}`);
        client.release();
        return `Error: Error in insertNewMessageForChatRoom for ${meetingRoomMessage.senderEmail} for meet id: ${meetingRoomMessage.meetingRoomId}`;
    }
}

export async function getNewMessagesForChatRoom(meetingRoomId: string) {
    const client = await dbPool.connect();
    try {
        const query: string = "SELECT id, meeting_room_id, text, sender_username, sender_email, timestamp FROM dbo.message WHERE meeting_room_id = $1 ORDER BY timestamp ASC";
        const result = await client.query(query, [meetingRoomId]);
        console.log(`${result.rowCount} rows retrieved`);
        client.release();
        const rows = result.rows;
        const processedResult: MeetingRoomMessage[] = rows.map(element => {
            return {
                id: element["id"],
                meetingRoomId: element["meeting_room_id"],
                text: element["text"],
                senderUsername: element["sender_username"],
                senderEmail: element["sender_email"],
                timestamp: element["timestamp"]
            }
        });
        return processedResult;
    } catch (error) {
        console.log(`Error in getNewMessagesForChatRoom: ${error}`);
        client.release();
        return [];
    }
}