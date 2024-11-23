import { signOut } from "@/auth"

export async function SignOutProfileLinks() {
    return <div>
        <form
            action={async () => {
                "use server"
                await signOut()
            }}
        >
            <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                <li>
                    <a className="justify-between">
                        Profile
                        <span className="badge">New</span>
                    </a>
                </li>
                <li>
                    <button type="submit">Sign Out</button>
                </li>
            </ul>
        </form>
    </div>
}