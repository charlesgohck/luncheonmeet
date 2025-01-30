import EditPostForm, { PostInfo } from "@/app/components/EditPostForm";
import { getPostFull } from "@/app/lib/db";
import { PageProps, PostWithIdPageParams } from "../../[id]/page";


export default async function PostWithId({ params }: PageProps<PostWithIdPageParams>) {

    const id: string = (await params).id;
    const postInfo: PostInfo = await getPostFull(id);

    return <>
        <section className="p5">
            <div className="prose-2xl text-center">Edit Meet</div>
            <div className="text-center">Meet Id: {id}</div>
            <EditPostForm editPostForm={postInfo} mode={"Edit"}  />
        </section>
    </>
}