'use client'

import axios from "axios";
import { useState } from "react";

export default function LeaveMeetButton({ meetId } : { meetId: string }) {
    
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>("");

    function leaveMeetAction(): void {
        setIsProcessing(true);
        axios.delete(`/api/post/leave?meet-id=${meetId}`)
            .then(data => {
                if (data.status === 200) {
                    setToastMessage(data.data.message);
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    console.log(data.data);
                    setToastMessage(data.data.message);
                    setIsProcessing(false);
                }
            }).catch(err => {
                setToastMessage(err);
                setIsProcessing(false);
            })
    }
    
    return <div>
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
        <button className="btn btn-warning" onClick={() => leaveMeetAction()}>
            {isProcessing ? <span className="loading loading-bars loading-xs"></span> : "Leave"}
        </button>
    </div>
}