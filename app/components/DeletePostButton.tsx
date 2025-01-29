'use client'

import { useRef, useState } from "react"
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { Payload } from "../(root)/models/api";
import { setAlertClasses } from "../lib/utils";

export default function DeletePostButton({ id, title }: { id: string, title: string }) {

    const dialogRef = useRef<HTMLDialogElement | null>(null);
    const [alertMessage, setAlertMessage] = useState("");
    const router = useRouter();

    const onConfirmDeletePost = async (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault();
        try {
            const response = await axios.delete(`/api/post/${id}`);
            // console.log(finalFormDetails);
            if (response.status === 202) {
                setAlertMessage(`Success: Deleted Meet ${id}`);
                setTimeout(() => {
                    router.push(`/post`);
                }, 1000);
            } else {
                setAlertMessage("Warning: Something went wrong when deleting. Please try again.")
                console.log(`Deletion of post ${id} not successful`);
            }
        } catch (error) {
            console.log("Error submitting form.");
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                if (axiosError.response?.status === 400) {
                    console.log("Form input validation issue.");
                } else if (axiosError.response?.status === 501 || axiosError.response!.status === 500) {
                    console.log("Internal error sending delete form");
                } else {
                    console.log("Unknown error occured with status code " + axiosError.response?.status);
                }
                const data: Payload<string> = axiosError.response?.data as Payload<string>;
                const message = data.message;
                setAlertMessage(message);
                setTimeout(() => {
                    setAlertMessage("")
                }, 4000);
            }
        }
    }

    return <>
        {
            alertMessage && alertMessage.length > 0 ? <div role="alert" className={`${setAlertClasses(alertMessage)} fixed top-4 right-4 space-y-4 z-50`}>
                {
                    alertMessage.startsWith("Error") ? <div className="flex justify-start">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="h-6 w-6 shrink-0 stroke-current">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span className="ml-1">{alertMessage}</span>
                    </div> : alertMessage.startsWith("Warning") ? <div className="flex justify-start">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 shrink-0 stroke-current"
                            fill="none"
                            viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span className="ml-1">{alertMessage}</span>
                    </div> : alertMessage.startsWith("Success") ? <div className="flex justify-start">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 shrink-0 stroke-current"
                            fill="none"
                            viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="ml-1">{alertMessage}</span>
                    </div> : <div role="alert" className="flex justify-start">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="h-6 w-6 shrink-0 stroke-current">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span className="ml-1">{alertMessage}</span>
                    </div>
                }
            </div> : <></>
        }
        <button className="btn btn-warning" onClick={() => dialogRef.current?.showModal()}>Delete</button>
        <dialog id="delete_post_confirmation_model" className="modal modal-bottom sm:modal-middle" ref={dialogRef}>
            <div className="modal-box">
                <h3 className="font-bold text-lg">Confirmation</h3>
                <p className="py-4">Please confirm the deletion of the Meet entry {title}.</p>
                <div className="modal-action">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-warning ml-1 mr-1" type="submit" onClick={onConfirmDeletePost}>Confirm</button>
                        <button className="btn btn-primary ml-1 mr-1">Close</button>
                    </form>
                </div>
            </div>
        </dialog>
    </>
}