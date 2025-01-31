import { getUserDetailsByUsername } from "@/app/lib/db";
import Image from 'next/image';
import { UserDetails } from "../../models/api";

interface PageProps<T> { params: Promise<T>; }

interface ProfileWithIdPageParams { username: string }

export default async function ProfileWithId({ params }: PageProps<ProfileWithIdPageParams>) {

    let username: string = (await params).username;
    const userDetails: UserDetails[] | null = await getUserDetailsByUsername(username);

    if (userDetails ===  null || userDetails.length !== 1) {
        return <section className="p5">
            <div className="flex justify-center flex-wrap w-full">
                <h1 className="prose-2xl">404: User not found.</h1>
            </div>
        </section>
    } 
    
    username = userDetails[0].username;
    const aboutMe: string = userDetails[0].about_me;
    const profilePicture: string = userDetails[0].profile_picture;
    const displayName: string = userDetails[0].display_name;

    return (
        <section className="p5">
            <div className="flex justify-center flex-wrap w-full">
                <div className="prose w-full text-center">Username</div>
                <div className="prose-xl w-full text-center">{username}</div>
                <div className="prose w-full text-center">Display Name</div>
                <div className="prose-2xl w-full text-center">{displayName}</div>
                <br /><br />
                <div className="w-full flex justify-center mb-5">
                    <Image 
                        src={profilePicture} 
                        width={100} 
                        height={100} 
                        alt={`Profile Picture for user ${username} with display name ${displayName}`} 
                    />
                </div>
                <div className="prose w-full text-center">About</div>
                <div className="prose-lg w-full text-center">{aboutMe}</div>
            </div>
        </section>
    )
}