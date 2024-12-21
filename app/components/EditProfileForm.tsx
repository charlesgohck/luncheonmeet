'use client'

import axios, { AxiosError } from "axios";
import Image from "next/image";
import React, { useState } from "react";
import { Payload } from "../(root)/models/api";

export interface EditProfileFormInfo {
    username: string,
    displayName: string,
    aboutMe: string,
}

export default function EditProfileForm(
    { username, displayName, aboutMe, profilePicture }:
        { username: string, displayName: string, aboutMe: string, profilePicture: string }
) {

    const [userDetails, setUserDetails] = useState<EditProfileFormInfo>({ username: username, displayName: displayName, aboutMe: aboutMe });
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isInputError, setIsInputError] = useState<boolean>(false);

    const handleTextBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUserDetails({
            ...userDetails,
            [name]: value
        })
    }

    const handleTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setUserDetails({
            ...userDetails,
            aboutMe: event.target.value
        })
    }

    const handleSubmitDetails = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post(`/api/profile/${username}`, userDetails);
            setLoading(false);
            if (response.status === 200) {
                console.log("Form submitted successfully!");
                console.log(response.data);
            } else {
                console.log("Form not successfully submitted.");
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
            <form className="form-control w-full max-w-xs" onSubmit={handleSubmitDetails}>
                <div className="w-full flex justify-center mb-5">
                    <Image
                        src={profilePicture}
                        width={100}
                        height={100}
                        alt={`Profile Picture for user ${userDetails["username"]} with display name ${userDetails["displayName"]}`}
                    />
                </div>
                <div className="label">
                    <span className="label-text">Username</span>
                </div>
                <input type="text" placeholder="Enter a username here." className="input input-bordered w-full max-w-xs" name="username" value={userDetails["username"]} onChange={handleTextBoxChange} />
                <div className="label">
                    <span className="label-text">Display Name</span>
                </div>
                <input type="text" placeholder="Enter a display name here." className="input input-bordered w-full max-w-xs" name="displayName" value={userDetails["displayName"]} onChange={handleTextBoxChange} />
                <div className="label">
                    <span className="label-text">About Me</span>
                </div>
                <textarea className="textarea textarea-bordered" placeholder="About Me" value={userDetails["aboutMe"]} onChange={handleTextAreaChange}></textarea>
                <br />
                <button className="btn btn-primary btn-outline" type="submit">Save</button>
            </form>
        </div>
    )
}