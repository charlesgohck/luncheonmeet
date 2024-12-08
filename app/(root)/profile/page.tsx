import { getUserDetails } from "@/app/lib/db";
import { auth } from "@/auth";
import Image from "next/image";

export default async function Profile() {

    const session = await auth();
    const profileImage = session && session.user && session.user.image ? session.user.image : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";
    const email = session?.user?.email;

    if (email === null || email === undefined) {
        return <section className="p5">
            <div className="flex justify-center flex-wrap w-full">
                <h1 className="prose-2xl">404: Personal profile not found.</h1>
            </div>
        </section>
    }

    const userDetails = await getUserDetails(email);

    const user = userDetails.length === 1 ? userDetails[0] : null;
    const username = user["username"];
    const displayName = user["display_name"];
    const aboutMe = user["about_me"];

    console.log(user);

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
                        src={user["profile_picture"]}
                        width={100}
                        height={100}
                        alt={`Profile Picture for user ${user["username"]} with display name ${displayName}`}
                    />
                </div>
                <div className="prose w-full text-center">About</div>
                <div className="prose-lg w-full text-center">{aboutMe}</div>
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text">Username</span>
                    </div>
                    <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                </label>
            </div>
        </section>
    )
}