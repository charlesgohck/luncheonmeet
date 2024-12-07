export default async function ProfileWithId() {
    return (
        <section className="p5">
            <div className="flex justify-center flex-wrap w-full">
                {/* <h1 className="text-center w-full" >Hello, {session?.user?.name}</h1> */}
                <br /><br />
                <div className="w-full flex justify-center mb-5">
                    {/* <Image src={profileImage} width={100} height={100} alt={"Profile Picture from federated login"} /> */}
                </div>
                <label className="form-control w-1/2">
                    <div className="label">
                        <span className="label-text">About Me</span>
                    </div>
                    <textarea className="textarea textarea-bordered h-24" placeholder="Write about me"></textarea>
                    <br/>
                    <button className="btn btn-outline btn-primary">Save</button>
                </label>
            </div>
        </section>
    )
}