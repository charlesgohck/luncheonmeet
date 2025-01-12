import { UserDetails } from "@/app/(root)/models/api";
import { VALID_ABOUT_ME_REGEX, VALID_DISPLAY_NAME_REGEX, VALID_USERNAME_REGEX } from "@/app/lib/constants";
import { getUserDetailsByUsername, editUserDetails } from "@/app/lib/db";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

// https://blog.logrocket.com/using-cors-next-js-handle-cross-origin-requests/
export async function POST(req: NextRequest, { params }: { params: Promise<{username: string}> }) {
    try {
        const session = await auth();
        const email = session?.user?.email;
        if (email === null || email === undefined) {
            console.log("Not logged in. POST /api/post aborted.");
            return NextResponse.json({ message: "Not logged in. POST /api/post aborted.", payload: false }, { status: 401 });
        }
        const originalUserName = (await params).username;
        const payload = await req.json();
        console.log(payload);
        const { username, displayName, aboutMe }: { username: string, displayName: string, aboutMe: string } = payload;
        console.log("Checking if user is authorized.")
        const userDetails: UserDetails[] = await getUserDetailsByUsername(username);
        if (userDetails.length === 0 || userDetails[0].username !== username) {
            console.log("User is not authorized to access this endpoint");
            return NextResponse.json({ message: "User not authorized. POST /api/post aborted.", payload: false }, { status: 403 });
        }
        console.log("Input validation checks for user detail updates.");
        if (username.length > 30 || !VALID_USERNAME_REGEX.test(username)) {
            console.log(username.length > 30, !VALID_USERNAME_REGEX.test(username), "Username input validation failed.");
            return NextResponse.json({ message: "Error: Username should be 30 characters or less and should not contain special characters or spaces other than -.", payload: null }, { status: 400 });
        } else if (displayName.length > 30 || !VALID_DISPLAY_NAME_REGEX.test(displayName)) {
            console.log(displayName.length > 30, !VALID_DISPLAY_NAME_REGEX.test(displayName), "Display name input validation failed.");
            return NextResponse.json({ message: "Error: Display name should be 30 characters or less and should not contain special characters other than -.", payload: null }, { status: 400 });
        } else if (aboutMe.length > 200 || !VALID_ABOUT_ME_REGEX.test(aboutMe)) {
            console.log(aboutMe.length > 200, !VALID_ABOUT_ME_REGEX.test(aboutMe), "About Me input validation failed.");
            return NextResponse.json({ message: "Error: About me should be 100 characters or less and should not contain special characters other than -.", payload: null }, { status: 400 });
        }
        console.log("Attempting to POST user details");
        // console.log(payload);
        await editUserDetails(originalUserName, username, displayName, aboutMe);
        // console.log(response);
        return NextResponse.json({ message: "Success", payload: null }, { status: 200 });
    } catch (error) {
        const err: string = `Error calling POST /api/profile/[username]`;
        console.log(err + " " + error);
        return NextResponse.json({ message: err, payload: null }, { status: 500 });
    }
}