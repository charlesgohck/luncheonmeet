import EditPostForm, { PostInfo } from "@/app/components/EditPostForm";
import SignInRequest from "@/app/components/SignInRequest";
import { auth } from "@/auth";
import { randomUUID } from "crypto";

export default async function Post() {

    const session = await auth();
    const email = session?.user?.email;
    if (email === null || email === undefined) {
        return <SignInRequest />
    }

    const newPost: PostInfo = {
        id: randomUUID(),
        title: "",
        description: "",
        start_time: new Date(),
        end_time: new Date(),
        location: "",
        last_updated_at: new Date(),
        last_updated_by: email,
        created_by: email
    };

    return (
        <section className="p5">
            <div className="prose-2xl text-center">New Meet</div>
            <EditPostForm editPostForm={newPost} mode="Create"  />
        </section>
    )
}