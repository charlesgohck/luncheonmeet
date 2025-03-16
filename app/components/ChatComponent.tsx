'use client'

import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { useCallback, useEffect, useRef, useState } from "react";

export interface MeetingRoomMessage {
    id: string;
    meetingRoomId: string,
    text: string;
    senderUsername: string;
    senderEmail: string;
    timestamp: Date;
}

export default function ChatComponent(
    { meetingRoomId, currentUsername, currentUserEmail }
    : { meetingRoomId: string, currentUsername: string, currentUserEmail: string }
) {

    const [messages, setMessages] = useState<MeetingRoomMessage[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [isMessageLoading, setIsMessageLoading] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to the latest message
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    };

    const handleRefreshMessages = useCallback(() => {
        setIsMessageLoading(true);
        axios.get(`/api/chat/${meetingRoomId}`)
            .then(data => {
                if (data.status === 200) {
                    setMessages(data.data.payload);
                } else {
                    setToastMessage("Error: Unable to load messages.");
                }
            }).catch((err) => {
                setToastMessage(`Error: ${err}`);
            }).finally(() => {
                setIsMessageLoading(false);
                resetToast();
            })
    }, [meetingRoomId]);

    useEffect(() => {
        let timerId: ReturnType<typeof setTimeout>;
        const tick = () => {
            handleRefreshMessages();
            timerId = setTimeout(tick, 30000);
        }
        tick();
        return () => clearTimeout(timerId);
    }, [handleRefreshMessages]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Handle message submission
    const handleSubmitMessage = () => {
        if (!newMessage.trim()) return;

        const message: MeetingRoomMessage = {
            id: uuidv4(),
            meetingRoomId: meetingRoomId,
            timestamp: new Date(),
            text: newMessage,
            senderEmail: currentUserEmail,
            senderUsername: currentUsername
        };

        setIsMessageLoading(true);

        axios.post("/api/chat", message)
            .then(data => {
                if (data.status === 201) {
                    setToastMessage("Success: Message sent.");
                    setMessages(data.data.payload);
                } else {
                    setToastMessage("Error: Unable to send message.");
                }
            }).catch(err => {
                setToastMessage(`Error: ${err}`);
            }).finally(() => {
                resetToast();
                setIsMessageLoading(false);
            });

        setMessages((prevMessages) => [...prevMessages, message]);
        setNewMessage('');
    };

    const resetToast = () => {
        setTimeout(() => {
            setToastMessage("");
        }, 5000)
    }

    return (
        <div className="flex flex-col h-[500px] w-full max-w-md mx-auto rounded-lg shadow-lg bg-base-100">
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
            
            {/* Chat header */}
            <div className="bg-primary text-primary-content px-4 py-3 rounded-t-lg">
                <h2 className="text-lg font-bold">Meeting Room</h2>
            </div>

            {/* Messages display area */}
            <div className="flex-1 p-4 overflow-y-auto" ref={messagesEndRef}>
                {
                    messages.map(message => (
                        <div
                            key={message.id}
                            className={`chat ${message.senderEmail === currentUserEmail ? 'chat-end' : 'chat-start'}`}
                        >
                            <div className={`chat-bubble ${message.senderEmail === currentUserEmail ? 'chat-bubble-primary' : 'chat-bubble-secondary'}`}>
                                {message.text}
                            </div>
                            <div className="chat-footer opacity-50 text-xs mt-1">
                                {`${message.senderEmail === currentUserEmail ? "You" : message.senderUsername}: ${new Date(message.timestamp).toLocaleDateString()} ${new Date(message.timestamp).toLocaleTimeString()}`}
                            </div>
                        </div>
                    ))
                }
            </div>

            {/* Message input form */}
            <div className="flex flex-col space-y-2 m-1">
                <textarea
                    className="textarea textarea-bordered w-full resize-none"
                    placeholder="Type your message here..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    rows={3}
                ></textarea>
                <div className="self-end">
                    <button
                        type="submit"
                        className="btn btn-success self-end m-1"
                        onClick={handleRefreshMessages}
                    >
                        {isMessageLoading ? <span className="loading loading-bars loading-xs"></span> : "Refresh"}
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary self-end m-1"
                        onClick={handleSubmitMessage}
                    >
                        {isMessageLoading ? <span className="loading loading-bars loading-xs"></span> : "Send"}
                    </button>
                </div>
            </div>
        </div>
    );
}