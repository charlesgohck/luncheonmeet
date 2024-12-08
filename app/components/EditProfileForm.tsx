'use client'

import axios, { formToJSON } from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export interface EditProfileFormInfo {
    username: string,
    displayName: string,
    aboutMe: string,
    profilePicture: string
}

export default function EditProfileForm(
    { username, displayName, aboutMe, profilePicture }: 
    { username: string, displayName: string, aboutMe: string, profilePicture: string }
) {

    const [userDetails, setUserDetails] = useState<EditProfileFormInfo>({ username: username, displayName: displayName, aboutMe: aboutMe, profilePicture: profilePicture });
    const [loading, setLoading] = useState<boolean>(false);

    const handleTextBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUserDetails({
            ...userDetails,
            [name]: value
        })
    }

    const handleTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setUserDetails({
            ...userDetails,
            [name]: value
        })
    }

    if (loading) {
        return <div className="flex justify-center flex-wrap w-full">
            <h1 className="prose-2xl">Loading...</h1>
        </div>
    }

    return (
        <div className="flex justify-center flex-wrap w-full">
            <label className="form-control w-full max-w-xs">
                <div className="w-full flex justify-center mb-5">
                    <Image
                        src={userDetails["profilePicture"]}
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
                <br/>
                <button className="btn btn-primary btn-outline" type="submit">Save</button>
            </label>
        </div>
    )
}