'use client'

import axios from "axios";
import { useState } from "react";

export interface InsertMeetupRoomParticipant {
    email: string,
    meetId: string,
    joined_at: string
}

export default function JoinMeetButton({ email, meetId } : { email: string, meetId: string }) {

    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>("");

    function joinMeetAction(): void {
        setIsProcessing(true);
        const insertRoomParticipant: InsertMeetupRoomParticipant = {
            email: email,
            meetId: meetId,
            joined_at: new Date().toUTCString()
        }
        axios.post("/api/post/join", insertRoomParticipant)
            .then(data => {
                if (data.status === 201) {
                    setToastMessage(data.data.message);
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    setToastMessage(data.data.message);
                    setIsProcessing(false);
                }
            }).catch(err => {
                setToastMessage(err);
                setIsProcessing(false);
            }).finally(() => {
                resetToast();
            });
    }

    const resetToast = () => {
        setTimeout(() => {
            setToastMessage("");
        }, 5000)
    }

    return (
        <div>
            {
                toastMessage.length === 0 ? <></> : <div className="toast toast-top toast-center">
                    {
                        toastMessage.includes("Success") ? <div className="alert alert-success">
                            <span>{toastMessage}</span>
                        </div> : <div className="alert alert-error">
                            <span>{toastMessage}</span>
                        </div>
                    }
                </div>
            }
            <button className="btn btn-primary" onClick={() => joinMeetAction()}>
                {isProcessing ? <span className="loading loading-bars loading-xs"></span> : "Join"}
            </button>
        </div>
    )
}