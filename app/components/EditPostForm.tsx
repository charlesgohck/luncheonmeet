'use client'

import axios, { AxiosError } from "axios";
import { useState } from "react";
import { Payload } from "../(root)/models/api";

export interface EditPostFormObject {
    id: string,
    title: string,
    description: string,
    startTime: Date,
    endTime: Date,
    location: string,
    lastUpdatedAt: Date,
    lastUpdatedBy: string,
    userEmail: string
}

export default function EditPostForm({ editPostForm }: { editPostForm: EditPostFormObject }) {

    const [editPostFormDetails, setEditPostFormDetails] = useState<EditPostFormObject>(editPostForm);
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isInputError, setIsInputError] = useState<boolean>(false);

    const handleTextBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setEditPostFormDetails({
            ...editPostFormDetails,
            [name]: value
        })
    }

    const handleTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setEditPostFormDetails({
            ...editPostFormDetails,
            [name]: value
        })
    }

    const handleSubmitPostForm = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post(`/api/post`, editPostFormDetails);
            setLoading(false);
            if (response.status === 200) {
                console.log("Post form submitted successfully!");
                console.log(response.data);
            } else {
                console.log("Post form not successfully submitted.");
            }
        } catch (error) {
            console.log("Error submitting form.");
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                if (axiosError.response?.status === 400) {
                    console.log("Form input validation issue.");
                    const data: Payload<string> = axiosError.response.data as Payload<string>;
                    const message = data.message;
                    setErrorMessage(message);
                    setIsInputError(true);
                    setTimeout(() => {
                        setIsInputError(false)
                    }, 4000);
                }
            }
            setLoading(false);
        }
    }

    console.log(editPostForm);

    if (loading) {
        return <div className="flex justify-center flex-wrap w-full">
            <div className="flex w-52 flex-col gap-4">
                <div className="flex items-center gap-4">
                    <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
                    <div className="flex flex-col gap-4">
                        <div className="skeleton h-4 w-20"></div>
                        <div className="skeleton h-4 w-28"></div>
                    </div>
                </div>
                <div className="skeleton h-32 w-full"></div>
            </div>
        </div>
    }

    return (
        <div className="flex justify-center flex-wrap w-full">
            {
                isInputError ? <div role="alert" className="alert alert-error">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 shrink-0 stroke-current"
                        fill="none"
                        viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{errorMessage}</span>
                </div> : <></>
            }
            <form className="form-control w-full max-w-xs" onSubmit={handleSubmitPostForm}>
                <div className="label">
                    <span className="label-text">Title</span>
                </div>
                <input type="text" placeholder="Enter a title for your activity." className="input input-bordered w-full max-w-xs" name="title" maxLength={30} value={editPostFormDetails.title} onChange={handleTextBoxChange} />
                <div className="label">
                    <span className="label-text">Description</span>
                </div>
                <textarea className="textarea textarea-bordered" placeholder="Enter a description for your activity." name="description" maxLength={200} value={editPostFormDetails.description} onChange={handleTextAreaChange}></textarea>
                <div className="label">
                    <span className="label-text">Location</span>
                </div>
                <input type="text" placeholder="Enter a title for your activity." className="input input-bordered w-full max-w-xs" name="location" maxLength={30} value={editPostFormDetails.location} onChange={handleTextBoxChange} />
                <div className="label">
                    <span className="label-text">Start Date/Time</span>
                </div>
                <input aria-label="Start Date and Time" type="datetime-local" className="input input-bordered w-full max-w-xs" name="startTime"/>
                <div className="label">
                    <span className="label-text">End Date/Time</span>
                </div>
                <input aria-label="Start Date and Time" type="datetime-local" className="input input-bordered w-full max-w-xs" name="endTime"/>
                <br />
                <button className="btn btn-primary btn-outline" type="submit">Create Post</button>
            </form>
        </div>
    )
}