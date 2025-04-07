<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" class="logo" width="120"/>

# Real-time Updates in NextJS 15 Using PostgreSQL NOTIFY and WebSockets

Implementing real-time updates in NextJS 15 using PostgreSQL's NOTIFY feature and WebSockets involves three main components: database triggers, a server-side listener, and a client-side WebSocket connection. This approach provides efficient, real-time updates without polling.

## PostgreSQL Database Setup

First, you need to create a function and trigger in PostgreSQL that will notify clients when data changes:

```sql
-- Create a notification function
CREATE OR REPLACE FUNCTION notify_data_change() 
RETURNS TRIGGER AS $$
DECLARE
  payload TEXT;
BEGIN
  -- Create a JSON payload with relevant information
  payload := json_build_object(
    'timestamp', CURRENT_TIMESTAMP,
    'operation', TG_OP,
    'schema', TG_TABLE_SCHEMA,
    'table', TG_TABLE_NAME,
    'id', NEW.id,
    'data', row_to_json(NEW)
  );
  
  -- Send notification with the payload
  PERFORM pg_notify('data_changes', payload);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger for a specific table (e.g., 'users')
CREATE TRIGGER users_change_trigger
AFTER INSERT ON users
FOR EACH ROW EXECUTE PROCEDURE notify_data_change();
```

This trigger will send a notification through the 'data_changes' channel whenever a record is inserted into the 'users' table[^1_1][^1_6].

## NextJS API Route: WebSocket Server

Next, create a WebSocket server in an API route that listens for PostgreSQL notifications and forwards them to connected clients.

Create a file at `pages/api/socket.js`:

```javascript
import { Server } from 'socket.io';
import { Pool } from 'pg';

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Don't use the connection pool for the listener
  max: 1
});

const SocketHandler = async (req, res) =&gt; {
  if (!res.socket.server.io) {
    console.log('Setting up Socket.io server...');
    
    // Initialize Socket.io
    const io = new Server(res.socket.server);
    res.socket.server.io = io;
    
    // Set up PostgreSQL notification listener
    const client = await pool.connect();
    
    // Listen for PostgreSQL notifications
    await client.query('LISTEN data_changes');
    
    // Forward PostgreSQL notifications to WebSocket clients
    client.on('notification', (msg) =&gt; {
      console.log('Database notification received:', msg.payload);
      io.emit('database-update', JSON.parse(msg.payload));
    });
    
    // Socket.io connection handling
    io.on('connection', (socket) =&gt; {
      console.log('Client connected:', socket.id);
      
      socket.on('disconnect', () =&gt; {
        console.log('Client disconnected:', socket.id);
      });
    });
    
    // Handle server shutdown
    process.on('SIGTERM', async () =&gt; {
      await client.query('UNLISTEN data_changes');
      await client.release();
    });
  }
  
  res.end();
};

export default SocketHandler;
```

This sets up both a Socket.io server and a PostgreSQL notification listener. When the database sends a notification, it's forwarded to all connected WebSocket clients[^1_2][^1_3][^1_7][^1_8].

## NextJS Client Component

Now, create a React component that connects to the WebSocket server and listens for updates:

```javascript
// components/DataListener.jsx
'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export default function DataListener() {
  const [updates, setUpdates] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() =&gt; {
    // Initialize the socket connection
    const initSocket = async () =&gt; {
      // Make a request to the API route to ensure the WebSocket server is running
      await fetch('/api/socket');
      
      const socket = io();
      
      socket.on('connect', () =&gt; {
        console.log('Connected to WebSocket server');
        setIsConnected(true);
      });
      
      socket.on('database-update', (data) =&gt; {
        console.log('Received update:', data);
        setUpdates(prev =&gt; [data, ...prev].slice(0, 10)); // Keep last 10 updates
      });
      
      socket.on('disconnect', () =&gt; {
        console.log('Disconnected from WebSocket server');
        setIsConnected(false);
      });
      
      // Cleanup on unmount
      return () =&gt; {
        socket.disconnect();
      };
    };

    initSocket();
  }, []);

  return (
    <div>
      <h2>Real-time Database Updates</h2>
      <div>
        {isConnected ? 'Connected' : 'Disconnected'}
      </div>
      
      <h3>Recent Updates</h3>
      <ul>
        {updates.map((update, index) =&gt; (
          <li>
            <strong>{update.operation}</strong> on {update.table} at {update.timestamp}
            <pre>{JSON.stringify(update.data, null, 2)}</pre>
          </li>
        ))}
      </ul>
    </div>
  );
}
```


## Using the Component in a Page

```javascript
// app/page.jsx
import DataListener from '../components/DataListener';

export default function Home() {
  return (
    &lt;main&gt;
      <h1>Real-time Database Updates</h1>
      &lt;DataListener /&gt;
    &lt;/main&gt;
  );
}
```


## Adding Socket.io Client Dependency

Install Socket.io client in your project:

```bash
npm install socket.io-client
```


## Configuration for Production

For production deployment, update your `next.config.js` to ensure WebSockets work properly:

```javascript
// next.config.js
module.exports = {
  reactStrictMode: true,
  poweredByHeader: false,
  webpack: (config, { isServer }) =&gt; {
    // Allow WebSocket connections
    if (!isServer) {
      config.externals = [...(config.externals || []), 'socket.io-client'];
    }
    return config;
  },
};
```

This complete solution creates a real-time update system where:

1. PostgreSQL notifies when data changes
2. A NextJS API route listens for those notifications and forwards them via WebSockets
3. Client components connect to the WebSocket server and update the UI in real-time[^1_4][^1_5][^1_9][^1_10]

The code is structured programmatically, focusing on reusable components and clear separation of concerns between the database, server, and client.

<div>⁂</div>

[^1_1]: https://www.bytefish.de/blog/postgres_listen_notify_dotnet.html

[^1_2]: https://www.postgresql.org/docs/current/libpq-notify.html

[^1_3]: https://github.com/andywer/pg-listen

[^1_4]: https://www.videosdk.live/developer-hub/websocket/nextjs-websocket

[^1_5]: https://clouddevs.com/next/real-time-notifications-with-websockets/

[^1_6]: https://www.cybertec-postgresql.com/en/listen-notify-automatic-client-notification-in-postgresql/

[^1_7]: https://stackoverflow.com/questions/73323716/how-to-correctly-listen-for-a-postgresql-notification-from-node-js

[^1_8]: https://blog.logrocket.com/implementing-websocket-communication-next-js/

[^1_9]: https://clouddevs.com/next/socketio-and-websocket-api/

[^1_10]: https://dev.to/danmusembi/building-real-time-apps-with-nextjs-and-websockets-2p39

[^1_11]: https://www.reddit.com/r/aws/comments/14hmfzp/what_are_my_options_to_send_a_notification/

[^1_12]: https://brandur.org/notifier

[^1_13]: https://www.postgresql.org/docs/current/sql-createtrigger.html

[^1_14]: https://gonzalo123.com/2021/10/25/listen-to-postgresql-events-with-pg_notify-and-python/

[^1_15]: https://gist.github.com/goliatone/5fbeb1912e5937e8e3cf94618be9bebf

[^1_16]: https://estuary.dev/blog/postgresql-triggers

[^1_17]: https://www.reddit.com/r/programming/comments/89832p/building_a_simple_notification_system_using_pg/

[^1_18]: https://www.enterprisedb.com/blog/listening-postgres-how-listen-and-notify-syntax-promote-high-availability-application-layer

[^1_19]: https://www.postgresql.org/docs/current/sql-notify.html

[^1_20]: https://blog.yarsalabs.com/notify-triggers-in-postgresql/

[^1_21]: https://stackoverflow.com/questions/72744466/getting-changes-on-the-client-with-db-collection-watch-and-nextjs-backend-api

[^1_22]: https://nextjs.org/docs/pages/building-your-application/routing/linking-and-navigating

[^1_23]: https://supabase.com/docs/guides/realtime/realtime-with-nextjs

[^1_24]: https://nextjs.org/docs/app/building-your-application/data-fetching/fetching

[^1_25]: https://github.com/vercel/next.js/discussions/66281

[^1_26]: https://www.reddit.com/r/PostgreSQL/comments/t8s80f/postgres_listennotify_and_realtime/

[^1_27]: https://nextjs.org/docs/app/getting-started/updating-data

[^1_28]: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations

[^1_29]: https://dev.to/ethanleetech/top-7-notification-solutions-for-nextjs-application-160k

[^1_30]: https://nextjs.org/docs/pages/building-your-application/data-fetching

[^1_31]: https://github.com/vercel/next.js/discussions/18208

[^1_32]: https://spin.atomicobject.com/postgres-listen-notify-events/

[^1_33]: https://github.com/vercel/next.js/discussions/14950

[^1_34]: https://socket.io/how-to/use-with-nextjs

[^1_35]: https://fly.io/javascript-journal/websockets-with-nextjs/

[^1_36]: https://www.pedroalonso.net/blog/websockets-nextjs-part-1/

[^1_37]: https://www.linkedin.com/pulse/real-time-data-nextjs-websockets-raghava-jagannatham-71vjc

[^1_38]: https://stackoverflow.com/questions/68263036/using-websockets-with-next-js

[^1_39]: https://www.pedroalonso.net/blog/websockets-nextjs-part-2/

[^1_40]: https://www.reddit.com/r/nextjs/comments/16m2jss/nextjs_and_websockets/

[^1_41]: https://www.youtube.com/watch?v=d80sB_zYuOs

[^1_42]: https://www.youtube.com/watch?v=9DEvkYB5_A4

[^1_43]: https://dba.stackexchange.com/questions/280873/postgresql-database-notification-trigger-that-only-returns-if-some-sql-is-met

[^1_44]: https://stackoverflow.com/questions/5412474/using-pg-notify-in-postgresql-trigger-function

[^1_45]: https://stackoverflow.com/questions/5173323/listen-notify-using-pg-notifytext-text-in-postgresql

[^1_46]: https://neon.tech/guides/pg-notify

[^1_47]: https://stackoverflow.com/questions/42347434/how-to-get-a-pg-notify-notification-for-every-inserted-row-in-postgres

[^1_48]: https://www.reddit.com/r/nextjs/comments/1d2si08/help_needed_how_to_immediately_reflect_db_updates/

[^1_49]: https://dev.to/ethanleetech/best-databases-for-real-time-updates-in-nextjs-1mkg

[^1_50]: https://jasonwatmore.com/nextjs-router-listen-to-route-location-change-with-userouter

[^1_51]: https://www.datocms.com/docs/next-js/real-time-updates

[^1_52]: https://stackoverflow.com/questions/66721377/how-to-input-realtime-data-into-nextjs

[^1_53]: https://www.reddit.com/r/nextjs/comments/1f1sw35/realtime_client_updates_with_websockets_and/

[^1_54]: https://kapsys.io/user-experience/real-time-updates-integrating-next-js-web-sockets-on-vercel

[^1_55]: https://blog.bytescrum.com/real-time-applications-with-nextjs-and-websockets

