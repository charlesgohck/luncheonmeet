'use client'

import { randomUUID } from "crypto";
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
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to the latest message
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Handle message submission
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const message: MeetingRoomMessage = {
            id: randomUUID(),
            meetingRoomId: meetingRoomId,
            timestamp: new Date(),
            text: newMessage,
            senderEmail: currentUserEmail,
            senderUsername: currentUsername
        };

        setMessages((prevMessages) => [...prevMessages, message]);
        setNewMessage('');
    };

    return (
        <div className="flex flex-col h-[500px] w-full max-w-md mx-auto rounded-lg shadow-lg bg-base-100">
            {/* Chat header */}
            <div className="bg-primary text-primary-content px-4 py-3 rounded-t-lg">
                <h2 className="text-lg font-bold">Meeting Room</h2>
            </div>

            {/* Messages display area */}
            <div className="flex-1 p-4 overflow-y-auto">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`chat ${message.senderEmail === currentUserEmail ? 'chat-end' : 'chat-start'}`}
                    >
                        <div className={`chat-bubble ${message.senderEmail === currentUserEmail ? 'chat-bubble-primary' : 'chat-bubble-secondary'}`}>
                            {message.text}
                        </div>
                        <div className="chat-footer opacity-50 text-xs mt-1">
                            {`${message.timestamp.toLocaleDateString()} ${message.timestamp.toLocaleTimeString()}`}
                        </div>
                    </div>
                ))}
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
                        Send Message
                    </button>
                </div>
            </form>
        </div>
    );
}