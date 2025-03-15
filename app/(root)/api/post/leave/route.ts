import { PostInfo } from "@/app/components/EditPostForm";
import { deleteParticipantForMeet, getPostFull } from "@/app/lib/db";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    try {
        const url: string = req.url;
        console.log(`Calling ${url}`);
        const session = await auth();
        const email = session?.user?.email;
        if (email === null || email === undefined) {
            console.log("Not logged in. DELETE /api/post/leave aborted.");
            return NextResponse.json({ message: "Not logged in. POST /api/post/leave aborted.", payload: false }, { status: 401 });
        }
        console.log(`Attempting to perform POST /api/post/leave for email: ${email}`);
        const query = req.nextUrl.searchParams;
        const meetId = query.get("meet-id") || "";

        const postInfo: PostInfo = await getPostFull(meetId);
        if (postInfo.created_by === email) {
            return NextResponse.json({ message: "Error: You are the admin and cannot leave the meeting.", payload: false }, { status: 403 });
        }

        const result: string = await deleteParticipantForMeet(email, meetId);
        console.log(result);
        if (result.startsWith("Success")) {
            return NextResponse.json({ message: result, payload: true }, { status: 200 });
        } else {
            return NextResponse.json({ message: result, payload: false }, { status: 500 });
        }
    } catch (error) {
        console.log(`Error calling POST api/post/join: ${error}`);
        return NextResponse.json({ message: "Failed to call POST for /api/post/join. Please try again.", payload: null });
    }
}