import { PostInfo } from "@/app/components/EditPostForm";
import { getPostFull, getUserDetails } from "@/app/lib/db";
import { UserDetails } from "../../models/api";
import Link from "next/link";

interface PageProps<T> { params: Promise<T>; }

interface PostWithIdPageParams { id: string }

export default async function PostWithId({ params }: PageProps<PostWithIdPageParams>) {

    let id: string = (await params).id;
    const postInfo: PostInfo = await getPostFull(id);

    if (postInfo === null || postInfo === undefined) {
        return <div className="prose-2xl text-center">
            Meet not found.
        </div>
    }

    const creatorDetails: UserDetails[] = await getUserDetails(postInfo.created_by);

    if (creatorDetails === null || creatorDetails === undefined || creatorDetails.length === 0) {
        return <div className="prose-2xl text-center">
            Meet creator not found.
        </div>
    }

    const creator: UserDetails = creatorDetails[0];

    return (
        <div className="p-1 text-center">
            <div className="prose-2xl">{postInfo.title}</div>
            <div className="prose-base">{postInfo.description}</div>
            <div className="prose-sm">{postInfo.start_time.toUTCString()} to {postInfo.end_time.toUTCString()}</div>
            <div className="prose-lg">{postInfo.location}</div>
            <div className="prose-sm">
                <div className="text-gray-400">Created By: {creator.display_name}</div>
            </div>
            <div className="flex w-full flex-col">
                <div className="divider"></div>
            </div>
            <div className="prose-2xl">Meet Group Room</div>
            <div className="prose-sm text-gray-400">Work in progress</div>
            <div className="flex w-full flex-col">
                <div className="divider"></div>
            </div>
            <Link href={"/post"}><button className="btn btn-primary">Back</button></Link>
        </div>
    )

}