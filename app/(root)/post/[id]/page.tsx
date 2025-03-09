import { MeetupRoomParicipant, PostInfo } from "@/app/components/EditPostForm";
import { getParticipantsForMeet, getPostFull, getUserDetails } from "@/app/lib/db";
import { UserDetails } from "../../models/api";
import Link from "next/link";
import { auth } from "@/auth";
import DeletePostButton from "@/app/components/DeletePostButton";
import SignInRequest from "@/app/components/SignInRequest";
import Image from "next/image";

export interface PageProps<T> { params: Promise<T>; }

export interface PostWithIdPageParams { id: string }

export default async function PostWithId({ params }: PageProps<PostWithIdPageParams>) {

    const session = await auth();
    const email = session?.user?.email;
    if (email === null || email === undefined) {
        return <SignInRequest />
    }

    const id: string = (await params).id;
    const postInfo: PostInfo = await getPostFull(id);
    const participantsForMeet: Array<MeetupRoomParicipant> = await getParticipantsForMeet(id);

    if (postInfo === null || postInfo === undefined) {
        return (
            <div className="text-center">
                <div className="prose-2xl">
                    Meet not found.
                </div>
                <div className="flex w-full flex-col">
                    <div className="divider"></div>
                </div>
                <Link href={"/post"}><button className="btn btn-primary">Back</button></Link>
            </div>

        )
    }

    const creatorDetails: UserDetails[] = await getUserDetails(postInfo.created_by);

    if (creatorDetails === null || creatorDetails === undefined || creatorDetails.length === 0) {
        return (
            <div className="text-center">
                <div className="prose-2xl text-center">
                    Meet creator not found.
                </div>
                <div className="flex w-full flex-col">
                    <div className="divider"></div>
                </div>
                <Link href={"/post"}><button className="btn btn-primary">Back</button></Link>
            </div>
        )
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
            {
                email === creator.email ? <div className="flex justify-center">
                    <DeletePostButton id={id} title={postInfo.title} />
                    <div className="p-1"></div>
                    <Link href={`/post/edit/${id}`}><button className="btn btn-primary">Edit</button></Link>
                </div> : <></>
            }
            <div className="flex w-full flex-col">
                <div className="divider"></div>
            </div>
            <div className="prose-sm">Current Participants: {participantsForMeet.length}/{postInfo.max_participants}</div>
            <div className="max-h-[25vh] overflow-y-auto">
                {
                    participantsForMeet.map(element => <Link href={`/profile/${element.username}`} key={`participant-${element.id}`}>
                        <div className="flex justify-center items-center">
                            <div className="avatar m-1">
                                <div className="w-8 rounded-sm">
                                    <Image width={20} height={20} src={element.profile_picture} alt={`Profile picture for user ${element.username}`} />
                                </div>
                            </div>
                            <div className="m-1">{element.username}{element.email === creator.email ? " (admin)" : " (user)"}</div>
                        </div>
                    </Link>)
                }
            </div>
            <div className="flex w-full flex-col">
                <div className="divider"></div>
            </div>
            <div className="prose-2xl">Meeting Room</div>
            <div className="prose-sm text-gray-400">Work in progress</div>
            <div className="flex w-full flex-col">
                <div className="divider"></div>
            </div>
            <Link href={"/post"}><button className="btn btn-primary">Back</button></Link>
        </div>
    )

}