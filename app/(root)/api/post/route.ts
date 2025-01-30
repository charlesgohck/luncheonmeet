import { PostInfo } from "@/app/components/EditPostForm";
import { isBefore, VALID_DESCRIPTION, VALID_TITLE } from "@/app/lib/constants";
import { createNewPost, updatePost } from "@/app/lib/db";
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
            console.log("Not logged in. POST /api/post aborted.");
            return NextResponse.json({ message: "Not logged in. POST /api/post aborted.", payload: false }, { status: 401 });
        }
        console.log(`Attempting to perform POST /api/post for email: ${email}`);
        const body: PostInfo = await req.json();
        console.log(body);
        if (body.id === null || body.id === undefined || body.id === "") {
            console.log("Provisioning new UUID for new post.")
            body.id = randomUUID();
        }
        if (body.title === "" || !VALID_TITLE.test(body.title)) {
            return NextResponse.json({ message: "Error: Title must be between 1 and 200 characters and contain only alphanumeric characters, spaces, and punctuation.", payload: false } , { status: 400 })
        }
        if (body.description === "" || !VALID_DESCRIPTION.test(body.description)) {
            return NextResponse.json({ message: "Error: Description must be between 1 and 500 characters and contain only alphanumeric characters, spaces, and punctuation.", payload: false } , { status: 400 })
        }
        if (body.location === "" || !VALID_TITLE.test(body.location)) {
            return NextResponse.json({ message: "Error: Location must be between 1 and 200 characters and contain only alphanumeric characters, spaces, and punctuation.", payload: false } , { status: 400 })
        }
        if (!isBefore(body.start_time, body.end_time)) {
            return NextResponse.json({ message: "Error: Start time should be before end time.", payload: true }, { status: 400 })
        }
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

export async function PUT(req: NextRequest) {
    try {
        const url: string = req.url;
        console.log(`Calling ${url}`);
        const session = await auth();
        const email = session?.user?.email;
        if (email === null || email === undefined) {
            console.log("Not logged in. PUT /api/post aborted.");
            return NextResponse.json({ message: "Not logged in. PUT /api/post aborted.", payload: false }, { status: 401 });
        }
        console.log(`Attempting to perform PUT /api/post for email: ${email}`);
        const body: PostInfo = await req.json();
        if (body.title === "" || !VALID_TITLE.test(body.title)) {
            return NextResponse.json({ message: "Error: Title must be between 1 and 200 characters and contain only alphanumeric characters, spaces, and punctuation.", payload: false } , { status: 400 })
        }
        if (body.description === "" || !VALID_DESCRIPTION.test(body.description)) {
            return NextResponse.json({ message: "Error: Description must be between 1 and 500 characters and contain only alphanumeric characters, spaces, and punctuation.", payload: false } , { status: 400 })
        }
        if (body.location === "" || !VALID_TITLE.test(body.location)) {
            return NextResponse.json({ message: "Error: Location must be between 1 and 200 characters and contain only alphanumeric characters, spaces, and punctuation.", payload: false } , { status: 400 })
        }
        if (!isBefore(body.start_time, body.end_time)) {
            return NextResponse.json({ message: "Error: Start time should be before end time.", payload: true }, { status: 400 })
        }
        const result: string = await updatePost(body);
        console.log(result);
        if (result.startsWith("Success")) {
            return NextResponse.json({ message: result, payload: true }, { status: 200 });
        } else {
            return NextResponse.json({ message: result, payload: false }, { status: 500 });
        }
    } catch (error) {
        console.log(`Error calling PUT /api/post: ${error}`);
        return NextResponse.json({ message: "Failed to call PUT for /api/post. Please try again.", payload: null });
    }
}