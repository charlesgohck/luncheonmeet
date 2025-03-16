import { MeetingRoomMessage } from "@/app/components/ChatComponent";
import { getNewMessagesForChatRoom, getParticipantsForMeet } from "@/app/lib/db";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params } : { params: Promise<{meetingid: string}> }) {
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