import { PostInfo } from "@/app/components/EditPostForm";
import SignInRequest from "@/app/components/SignInRequest";
import { auth } from "@/auth";
import axios, { AxiosError } from "axios";
import { randomUUID } from "crypto";
import { Payload } from "../../models/api";
import { isBefore, VALID_DESCRIPTION, VALID_TITLE } from "@/app/lib/constants";
import { createNewPost } from "@/app/lib/db";

export async function handleSubmitPostForm(formData: FormData) {
    'use server'
    await new Promise((resolve) => setTimeout(resolve, 250));
    try {
        const session = await auth();
        let email = session?.user?.email;
        if (email === null || email === undefined) {
            console.log("Not logged in. Action aborted.");
            email = "N/A";
        }
        console.log(`Attempting to perform action for email: ${email}`);

        const startTime = new Date(formData.get("start_time") as string);
        const endTime = new Date(formData.get("end_time") as string);
        const finalFormDetails: PostInfo = {
            id: randomUUID(),
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            start_time: startTime,
            end_time: endTime,
            location: formData.get('location') as string,
            last_updated_at: new Date(),
            last_updated_by: formData.get('created_by') as string,
            created_by: email,
            max_participants: Number(formData.get('max_participants') as string)
        };

        const body: PostInfo = finalFormDetails;
        console.log(body);
        if (body.id === null || body.id === undefined || body.id === "") {
            console.log("Provisioning new UUID for new post.")
            body.id = randomUUID();
        }
        if (body.title === "" || !VALID_TITLE.test(body.title)) {
            return console.log({ message: "Error: Title must be between 1 and 200 characters and contain only alphanumeric characters, spaces, and punctuation.", payload: false } , { status: 400 })
        }
        if (body.description === "" || !VALID_DESCRIPTION.test(body.description)) {
            return console.log({ message: "Error: Description must be between 1 and 500 characters and contain only alphanumeric characters, spaces, and punctuation.", payload: false } , { status: 400 })
        }
        if (body.location === "" || !VALID_TITLE.test(body.location)) {
            return console.log({ message: "Error: Location must be between 1 and 200 characters and contain only alphanumeric characters, spaces, and punctuation.", payload: false } , { status: 400 })
        }
        if (!isBefore(body.start_time, body.end_time)) {
            console.log({ message: "Error: Start time should be before end time.", payload: true }, { status: 400 })
        }
        const result: string = await createNewPost(body);
        console.log(result);
        if (result.startsWith("Success")) {
            console.log({ message: result, payload: true }, { status: 201 });
        } else {
            console.log({ message: result, payload: false }, { status: 500 });
        }

        // I think instead of axios we need to pass in the actual object to the function to process
        // await axios.put(`/api/post`, finalFormDetails) : await axios.post(`/api/post`, finalFormDetails);
        // // console.log(finalFormDetails);
        // if (response.status === 201 || response.status === 200) {
        //     // console.log("Post form submitted successfully!");
        //     // console.log(response.data);
        //     setAlertMessage("Success: Created new Meet!");
        //     // console.log(`Routing to /post/${finalFormDetails.id}`);
        //     setTimeout(() => {
        //         router.push(`/post/${finalFormDetails.id}`);
        //     }, 1000);
        // } else {
        //     setAlertMessage("Warning: Something went wrong when submitting. Please try again.")
        //     console.log("Post form not successfully submitted.");
        // }
    } catch (error) {
        console.log("Error submitting form.");
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            if (axiosError.response?.status === 400) {
                console.log("Form input validation issue.");
            } else if (axiosError.response?.status === 501 || axiosError.response!.status === 500) {
                console.log("Internal error sending POST/PUT form");
            } else {
                console.log("Unknown error occured with status code " + axiosError.response?.status);
            }
            const data: Payload<string> = axiosError.response?.data as Payload<string>;
            const message = data.message;
            console.log(`Axios Error: ${message}`);
        }
    }
}

export default async function Post() {

    const session = await auth();
    const email = session?.user?.email;
    if (email === null || email === undefined) {
        return <SignInRequest />
    }

    const mode: string = "Create Meet";

    const newPost: PostInfo = {
        id: randomUUID(),
        title: "",
        description: "",
        start_time: new Date(),
        end_time: new Date(),
        location: "",
        last_updated_at: new Date(),
        last_updated_by: email,
        created_by: email,
        max_participants: 20
    };

    return (
        <section className="p5">
            <div className="prose-2xl text-center">New Meet</div>
            <div className="flex justify-center flex-wrap w-full">
                <form className="form-control w-full max-w-xs" action={handleSubmitPostForm}>
                    <div className="label">
                        <span className="label-text">Title</span>
                    </div>
                    <input type="text" placeholder="Enter a title for your activity." className="input input-bordered w-full max-w-xs" name="title" maxLength={30}/>
                    <div className="label">
                        <span className="label-text">Description</span>
                    </div>
                    <textarea className="textarea textarea-bordered" placeholder="Enter a description for your activity." name="description" maxLength={200}></textarea>
                    <div className="label">
                        <span className="label-text">Location</span>
                    </div>
                    <input type="text" placeholder="Enter a location for your activity." className="input input-bordered w-full max-w-xs" name="location" maxLength={30}/>
                    <div className="label">
                        <span className="label-text">Max Participants</span>
                    </div>
                    <input type="number" min="2" max="2000" placeholder="Enter max participants." className="input input-bordered w-full max-w-xs" name="max_participants" maxLength={30}/>
                    <div className="label">
                        <span className="label-text">Start Date/Time Local Date Time</span>
                    </div>
                    <input aria-label="Start Date and Time" type="datetime-local" className="input input-bordered w-full max-w-xs" name="start_time"/>
                    <div className="label">
                        <span className="label-text">End Date/Time Local Date Time</span>
                    </div>
                    <input aria-label="Start Date and Time" type="datetime-local" className="input input-bordered w-full max-w-xs" name="end_time"/>
                    <br />
                    <button className="btn btn-primary btn-outline" type="submit">{mode === "Edit" ? "Edit Meet" : "Create Meet"}</button>
                </form>
            </div>
        </section>
    )
}