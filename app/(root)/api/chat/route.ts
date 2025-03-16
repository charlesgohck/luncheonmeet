import { MeetingRoomMessage } from "@/app/components/ChatComponent";
import { getNewMessagesForChatRoom, insertNewMessageForChatRoom } from "@/app/lib/db";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const url: string = req.url;
        console.log(`Calling ${url}`);
        const session = await auth();
        const email = session?.user?.email;
        if (email === null || email === undefined) {
            console.log("Not logged in. POST /api/chat aborted.");
            return NextResponse.json({ message: "Not logged in. POST /api/chat aborted.", payload: false }, { status: 401 });
        }
        console.log(`Attempting to perform POST /api/chat for email: ${email}`);
        const meetingRoomMessage: MeetingRoomMessage = await req.json();
        if (meetingRoomMessage.senderEmail === email) {
            const result = await insertNewMessageForChatRoom(meetingRoomMessage);
            console.log(result);
            const updatedMessages = await getNewMessagesForChatRoom(meetingRoomMessage.meetingRoomId);
            console.log(updatedMessages);
            return NextResponse.json({ message: "Success: Inserted new messages and returned updated messages.", payload: updatedMessages }, { status: 201 });
        } else {
            const errorMessage: string = `Error: Forbidden action. Logged in user ${email} does not match attempted message submission for ${meetingRoomMessage.senderEmail}`;
            console.log(errorMessage);
            return NextResponse.json({ message: errorMessage, payload: false }, { status: 403 });
        }
    } catch (error) {
        console.log(`Error calling POST /api/chat: ${error}`);
        return NextResponse.json({ message: "Failed to call POST for /api/chat. Please try again.", payload: null });
    }
}