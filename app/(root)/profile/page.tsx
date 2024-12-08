import EditProfileForm from "@/app/components/EditProfileForm";
import { getUserDetails } from "@/app/lib/db";
import { auth } from "@/auth";

export default async function Profile() {

    const session = await auth();
    const profileImage = session && session.user && session.user.image ? session.user.image : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";
    const email = session?.user?.email;

    if (email === null || email === undefined) {
        return <section className="p5">
            <div className="flex justify-center flex-wrap w-full">
                <h1 className="prose-2xl">404: Your profile cannot be found.</h1>
            </div>
        </section>
    }

    const userDetails = await getUserDetails(email);

    const user = userDetails.length === 1 ? userDetails[0] : null;
    const username = user["username"];
    const displayName = user["display_name"];
    const aboutMe = user["about_me"];
    const profilePicture = user["profile_picture"];

    return (
        <section className="p5">
            <EditProfileForm username={username} displayName={displayName} aboutMe={aboutMe} profilePicture={profilePicture} />
        </section>
    )
}