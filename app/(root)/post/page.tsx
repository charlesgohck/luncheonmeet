import { PostInfo } from "@/app/components/EditPostForm"
import { getPostsShort, MAX_DATE } from "@/app/lib/db"
import Link from "next/link";

export default async function PostListing() {

    const postInfo: PostInfo[] = await getPostsShort(new Date(), MAX_DATE, 0);
    // console.log(postInfo);

    return <section className="p-5">
        <div className="flex flex-wrap justify-evenly">
            <div className="w-full text-center">
              <Link href={"/post/new"}><button className="btn btn-primary">New Meet</button></Link>
            </div>
            <div className="flex w-full flex-col">
                <div className="divider"></div>
            </div>
            <div className="w-full text-center prose-2xl">Upcoming Luncheon Meets</div>
            {
                postInfo.map(element => {
                  return <div className="card bg-base-100 w-[80%] shadow-xl m-5" key={element.id + "-Meetup-Post"}>
                    <div className="card-body">
                      <h2 className="card-title">{element.title}</h2>
                      <p className="prose-lg">{element.location}</p>
                      <p className="prose-md">{element.description.slice(0, 50)}</p>
                      <p className="prose-sm">{element.start_time.toUTCString()} to {element.end_time.toUTCString()}</p>
                      <div className="card-actions justify-end">
                        <Link href={`/post/${element.id}`}><button className="btn btn-primary">More</button></Link>
                      </div>
                    </div>
                  </div>
                })
            }
        </div>
    </section>

}