import { getUserDetailsByUsername } from "@/app/lib/db";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest, { params }: { params: Promise<{ username: string }> }) {
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
        console.log(`Error called /api/profile/[username]: ${error}`);
        return NextResponse.json({ message: "Failed to get user details. Please try again.", payload: null });
    }
}