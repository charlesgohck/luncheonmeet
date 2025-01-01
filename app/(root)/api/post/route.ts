import { PostInfo } from "@/app/components/EditPostForm";
import { createNewPost } from "@/app/lib/db";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const url: string = req.url;
        console.log(`Calling ${url}`);
        const session = await auth();
        const email = session?.user?.email;
        if (email === null || email === undefined) {
            console.log("Not logged in. POST /api/post aborted.");
            return NextResponse.json({ message: "Not logged in. POST /api/post aborted.", payload: false }, { status: 403 });
        }
        console.log(`Attempting to perform POST /api/post for email: ${email}`);
        const body: PostInfo = await req.json();
        console.log(body);
        const result: string = await createNewPost(body);
        console.log(result);
        if (result.startsWith("Success")) {
            return NextResponse.json({ message: result, payload: true }, { status: 201 });
        } else {
            return NextResponse.json({ message: result, payload: false }, { status: 500 });
        }
    } catch (error) {
        console.log(`Error calling POST /api/post: ${error}`);
        return NextResponse.json({ message: "Failed to call POST for /api/post. Please try again.", payload: null });
    }
}