import { auth, signIn, signOut } from "@/auth"
import Image from "next/image";
import Link from "next/link";
import { getUserDetails, insertUserDetails } from '@/app/lib/db';

async function signInAction() {
    "use server"
    await signIn("google");
}

async function signOutAction() {
    "use server"
    await signOut();
}

async function checkAndAddUser() {
    const session = await auth();
    console.log("Is user existing?");
    try {
        if (session && session.user && session.user.email) {
            const matchingUsers = await getUserDetails(session.user.email);
            if (matchingUsers.length === 0) {
                const insertResults = await insertUserDetails(session.user.email, session.user.image ? session.user.image : "");
                console.log(`User added: ${session.user.email}`);
            } else {
                console.log(`User exists: ${session.user.email}`);
            }
        } else {
            console.log("User is null or does not have an email or something is not right.");
        }
    } catch (error) {
        console.trace(`Error while checking or adding user: ${error}`);
    }
}

export async function AuthNavBar() {

    const session = await auth();
    if (session) {
        checkAndAddUser();
    }
    const profileImage = session && session.user && session.user.image ? session.user.image : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";

    return (
        <div className="navbar bg-base-100">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle lg:hidden">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        <li><a>Meet</a></li>
                        <li><a>About</a></li>
                    </ul>
                </div>
                <Link className="btn btn-ghost text-xl" href={"/"}>
                    <Image src={"/images/Logo.png"} alt={"Luncheon Meet Logo"} width={50} height={50} />
                </Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><a>Meet</a></li>
                    <li><a>About</a></li>
                </ul>
            </div>
            <div className="navbar-end">
                {
                    session && session?.user ? (
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full">
                                    <Image src={profileImage} width={50} height={50} alt={"Profile Picture"} />
                                </div>
                            </div>
                            <div>
                                <ul
                                    tabIndex={0}
                                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                                    <li>
                                        <Link href={"/profile"}>
                                            Profile
                                        </Link>
                                    </li>
                                    <li>
                                        <button onClick={signOutAction}>Sign Out</button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <button className="btn btn-primary btn-outline" onClick={signInAction}>Sign In with Google</button>
                        </div>
                    )
                }
            </div>
        </div>
    )
}