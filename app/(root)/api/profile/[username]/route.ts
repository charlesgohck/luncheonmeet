import { getUserDetailsByUsername, editUserDetails } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ username: string }> }) {
    try {
        const username = (await params).username;
        var userDetails = null;
        console.log(`Attempting to get user details for username: ${username}`);
        if (username !== null && username !== undefined && username !== "") {
            userDetails = await getUserDetailsByUsername(username);
            // console.log(userDetails);
        }
        return NextResponse.json({ message: 'Successfully retrieved ', payload: userDetails }, { status: 200 })
    } catch (error) {
        console.log(`Error calling GET /api/profile/[username]: ${error}`);
        return NextResponse.json({ message: "Failed to get user details. Please try again.", payload: null });
    }
}

// https://blog.logrocket.com/using-cors-next-js-handle-cross-origin-requests/
export async function POST(req: NextRequest, { params }: { params: Promise<{username: string}> }) {
    try {
        const originalUserName = (await params).username;
        const payload = await req.json();
        const { username, displayName, aboutMe } = payload;
        console.log("Attempting to POST user details");
        console.log(payload);
        const response = await editUserDetails(originalUserName, username, displayName, aboutMe);
        console.log(response);
        return NextResponse.json({ message: "Success", payload: null }, { status: 200 });
    } catch (error) {
        const err: string = `Error calling POST /api/profile/[username]`;
        console.log(err + " " + error);
        return NextResponse.json({ message: err, payload: null }, { status: 500 });
    }
}