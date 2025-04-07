import { Client } from "pg";

// Models
// types/pg-notification.ts
export interface DatabaseChangePayload {
    timestamp: string;
    operation: string;
    schema: string;
    table: string;
    id: number;
    data: Record<string, any>;
}

// Singleton for notification listener (separate from the pool)
let chatNotificationClient: Client | null = null;

export async function getChatNotificationClient(): Promise<Client> {
    if (!chatNotificationClient) {
        chatNotificationClient = new Client({
            connectionString: process.env.DATABASE_URL
        });

        await chatNotificationClient.connect();
        console.log('Chat Notification client connected');

        // Set up cleanup on application shutdown
        process.on('SIGTERM', async () => {
            if (chatNotificationClient) {
                await chatNotificationClient.end();
                chatNotificationClient = null;
                console.log('Notification client disconnected');
            }
        });
    }

    return chatNotificationClient;
}