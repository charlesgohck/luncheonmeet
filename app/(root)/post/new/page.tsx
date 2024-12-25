import EditPostForm, { PostInfo } from "@/app/components/EditPostForm";

export default async function Post() {

    const newPost: PostInfo = {
        id: "",
        title: "",
        description: "",
        start_time: new Date(),
        end_time: new Date(),
        location: "",
        last_updated_at: new Date(),
        last_updated_by: "",
        created_by: ""
    };

    return (
        <section className="p5">
            Under Development
            <EditPostForm editPostForm={newPost}  />
        </section>
    )
}