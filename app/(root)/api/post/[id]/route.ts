import { PostInfo } from "@/app/components/EditPostForm";
import { deletePost, getPostFull } from "@/app/lib/db";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{id: string}> }) {
    try {
        const session = await auth();
        const email = session?.user?.email;
        if (email === null || email === undefined) {
            console.log("Not logged in. POST /api/post aborted.");
            return NextResponse.json({ message: "Not logged in. POST /api/post aborted.", payload: false }, { status: 401 });
        }
        const id = (await params).id;
        const postItemForId : PostInfo = await getPostFull(id);
        if (postItemForId.created_by !== email) {
            const message: string = `User ${email} forbidden from making post DELETE call for ${id}`;
            console.log(message);
            return NextResponse.json({ message: message }, { status: 403 });
        }
        const result: string = await deletePost(postItemForId);
        if (result.startsWith("Error")) {
            return NextResponse.json({ message: result }, { status: 500 });
        }
        return NextResponse.json({ message: "Success: Deletion and archival succsesful."}, { status: 202 });
    } catch (error) {
        const err: string = `Error deleting and archiving the post.`;
        console.log(err + " " + error);
        return NextResponse.json({ message: err, payload: null }, { status: 500 });
    }
}