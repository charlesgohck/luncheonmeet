import EditPostForm, { EditPostFormObject } from "@/app/components/EditPostForm";

export default async function Post() {

    const newPost: EditPostFormObject = {
        userEmail: "",
        id: "",
        title: "",
        description: "",
        startTime: new Date(),
        endTime: new Date(),
        location: "",
        lastUpdatedAt: new Date(),
        lastUpdatedBy: ""
    };

    return (
        <section className="p5">
            <EditPostForm editPostForm={newPost}  />
        </section>
    )
}