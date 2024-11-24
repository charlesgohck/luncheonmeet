import { auth, signIn } from "@/auth"
import Image from "next/image";
import { SignOutProfileLinks } from "./SignOut";

export async function NavBar() {

    const session = await auth();
    const profileImage = session && session.user && session.user.image ? session.user.image : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";

    return (
        <div className="navbar bg-base-100">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
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
                        <li><a>Homepage</a></li>
                        <li><a>Portfolio</a></li>
                        <li><a>About</a></li>
                    </ul>
                </div>
            </div>
            <div className="navbar-center">
                <a className="btn btn-ghost text-xl">
                    <Image src={"/images/Logo.png"} alt={"Luncheon Meet Logo"} width={50} height={50}/>
                </a>
            </div>
            <div className="navbar-end">
                {
                    session && session?.user ? (
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full">
                                    <Image src={profileImage} width={50} height={50} alt={"Profile Picture"}/>
                                </div>
                            </div>
                            <SignOutProfileLinks/>
                        </div>
                    ) : (
                        <div>
                            <form
                                action={async () => {
                                    "use server"
                                    await signIn("google")
                                }}
                            >
                                <button className="btn btn-primary btn-outline" type="submit">Sign In with Google</button>
                            </form>

                        </div>
                    )
                }
            </div>
        </div>
    )
}