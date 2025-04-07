import { MeetingRoomMessage } from "@/app/components/ChatComponent";
import { getNewMessagesForChatRoom, getParticipantsForMeet } from "@/app/lib/db";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import type { NextApiRequest, NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';
import type { Server as HTTPServer } from 'http';
import type { Socket } from 'net';
import { Notification } from "pg";
import { DatabaseChangePayload, getChatNotificationClient } from "@/app/lib/sockets";

export async function GET(req: NextRequest, { params }: { params: Promise<{ meetingid: string }> }) {
    try {
        const url: string = req.url;
        console.log(`Calling ${url}`);
        const session = await auth();
        const email = session?.user?.email;
        if (email === null || email === undefined) {
            console.log("Not logged in. GET /api/chat aborted.");
            return NextResponse.json({ message: "Not logged in. GET /api/chat aborted.", payload: false }, { status: 401 });
        }
        const meetId = (await params).meetingid;
        const participants = await getParticipantsForMeet(meetId);
        const targetParticipant = participants.find(participant => participant.email === email);
        if (targetParticipant === undefined) {
            const errorMessage: string = `Error: User ${email} is forbidden from accessing other meeting room data.`;
            console.log(errorMessage);
            return NextResponse.json({ message: errorMessage, payload: false }, { status: 200 });
        } else {
            const updatedMessages: MeetingRoomMessage[] = await getNewMessagesForChatRoom(meetId);
            console.log(updatedMessages);
            return NextResponse.json({ message: `Success: Retrieved updated messages for ${meetId}`, payload: updatedMessages }, { status: 200 });
        }
    } catch (error) {
        console.log(`Error calling GET /api/chat: ${error}`);
        return NextResponse.json({ message: "Failed to call GET for /api/chat. Please try again.", payload: null });
    }
}

interface SocketIONextApiResponse extends NextApiResponse {
    socket: Socket & {
        server: HTTPServer & {
            io?: SocketIOServer;
        };
    };
}

let io: SocketIOServer | null = null;

const SocketHandler = async (
    req: NextApiRequest,
    res: SocketIONextApiResponse
): Promise<void> => {
    if (!res.socket.server.io) {
        console.log('Setting up Socket.io server...');

        // Initialize Socket.io as a singleton
        io = new SocketIOServer(res.socket.server);
        res.socket.server.io = io;

        // Get the dedicated notification client (singleton)
        const client = await getChatNotificationClient();

        // Set up PostgreSQL notification listener if not already set up
        if (!client.listenerCount('notification')) {
            await client.query('LISTEN message_chat_changes');

            client.on('notification', (msg: Notification) => {
                console.log('Database notification received:', msg.payload);
                if (io) {
                    if (!msg.payload) {
                        console.error("Received empty notification payload");
                    } else {
                        try {
                            const payload: DatabaseChangePayload = JSON.parse(msg.payload);
                            io.emit('chat-update', payload);
                        } catch (error) {
                            console.error('Error parsing notification payload:', error);
                        }
                    }
                } else {
                    console.error("Socket IO on server is null");
                }
            });

            console.log('PostgreSQL notification listener established');
        }

        // Socket.io connection handling
        io.on('connection', (socket) => {
            console.log('Client connected:', socket.id);

            socket.on('disconnect', () => {
                console.log('Client disconnected:', socket.id);
            });
        });
    }

    res.end();
};