import { getUserDetails } from "@/app/lib/db";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { UserDetails } from "../../models/api";

export async function GET(req: NextRequest) {
    try {
        const url: string = req.url;
        console.log(`Calling ${url}`);
        const session = await auth();
        const email = session?.user?.email;
        console.log(`Attempting to get user details for email: ${email}`);
        if (email !== null && email !== undefined && email !== "") {
            const userDetails: UserDetails[] = await getUserDetails(email);
            return NextResponse.json({ message: 'Successfully retrieved user details.', payload: userDetails }, { status: 200 })
        } else {
            return NextResponse.json({ message: 'Failed to retrieve user details.', payload: null }, { status: 400 })
        }
    } catch (error) {
        console.log(`Error calling GET /api/profile: ${error}`);
        return NextResponse.json({ message: "Failed to get user details for current user. Please try again.", payload: null });
    }
}