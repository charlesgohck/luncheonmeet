'use client'

import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { FormEvent, useEffect, useRef, useState } from "react";

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
    const [isMessageSending, setIsMessageSending] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to the latest message
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
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
                resetToast();
            })
    }, [])

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Handle message submission
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const message: MeetingRoomMessage = {
            id: uuidv4(),
            meetingRoomId: meetingRoomId,
            timestamp: new Date(),
            text: newMessage,
            senderEmail: currentUserEmail,
            senderUsername: currentUsername
        };

        setIsMessageSending(true);

        axios.post("/api/chat", message)
            .then(data => {
                if (data.status === 201) {
                    setToastMessage("Message sent.");
                    setMessages(data.data.payload);
                } else {
                    setToastMessage("Unable to send message.");
                }
            }).catch(err => {
                setToastMessage(`Error: ${err}`);
            }).finally(() => {
                resetToast();
                setIsMessageSending(false);
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
            <div className="flex-1 p-4 overflow-y-auto">
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
                                {`${new Date(message.timestamp).toLocaleDateString()} ${new Date(message.timestamp).toLocaleTimeString()}`}
                            </div>
                        </div>
                    ))
                }
                <div ref={messagesEndRef} />
            </div>

            {/* Message input form */}
            <form onSubmit={handleSubmit} className="border-t border-base-300 p-4">
                <div className="flex flex-col space-y-2">
                    <textarea
                        className="textarea textarea-bordered w-full resize-none"
                        placeholder="Type your message here..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        rows={3}
                    ></textarea>
                    <button
                        type="submit"
                        className="btn btn-primary self-end"
                    >
                        {isMessageSending ? <span className="loading loading-bars loading-xs"></span> : "Send"}
                    </button>
                </div>
            </form>
        </div>
    );
}