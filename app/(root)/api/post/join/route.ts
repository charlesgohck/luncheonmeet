import { MeetupRoomParticipant } from "@/app/components/EditPostForm";
import { InsertMeetupRoomParticipant } from "@/app/components/JoinMeetButton";
import { insertParticipantForMeet } from "@/app/lib/db";
import { auth } from "@/auth";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const url: string = req.url;
        console.log(`Calling ${url}`);
        const session = await auth();
        const email = session?.user?.email;
        if (email === null || email === undefined) {
            console.log("Not logged in. POST /api/post/join aborted.");
            return NextResponse.json({ message: "Not logged in. POST /api/post aborted.", payload: false }, { status: 401 });
        }
        console.log(`Attempting to perform POST /api/post/join for email: ${email}`);
        const body: InsertMeetupRoomParticipant = await req.json();
        console.log(body);
        const result: string | null = await insertParticipantForMeet(body);
        console.log(result);
        if (result == null) {
            return NextResponse.json({ message: "Error: user already exists", payload: false }, { status: 403 })
        } else if (result.startsWith("Success")) {
            return NextResponse.json({ message: result, payload: true }, { status: 201 });
        } else {
            return NextResponse.json({ message: result, payload: false }, { status: 500 });
        }
    } catch (error) {
        console.log(`Error calling POST api/post/join: ${error}`);
        return NextResponse.json({ message: "Failed to call POST for /api/post/join. Please try again.", payload: null });
    }
}