import { signInAction } from "./AuthNavbar";

export default async function SignInRequest() {
    return (
        <section className="p-5 text-center">
            <div className="prose-2xl">Please sign in to continue.</div>
            <br/>
            <button className="btn btn-primary" onClick={signInAction}>Sign In with Google</button>
        </section>
    );
}