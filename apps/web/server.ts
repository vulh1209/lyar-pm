import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { WebSocketServer, WebSocket } from "ws";
import type { WSMessage, WSEventType } from "@lyar/types";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

// Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Track connected clients
const clients = new Set<WebSocket>();

// Broadcast message to all connected clients
export function broadcast<T>(type: WSEventType, payload: T): void {
  const message: WSMessage<T> = {
    type,
    payload,
    timestamp: new Date().toISOString(),
  };

  const data = JSON.stringify(message);

  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  }
}

// Start server
app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url || "", true);
    handle(req, res, parsedUrl);
  });

  // Create WebSocket server attached to HTTP server
  const wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", (ws) => {
    console.log("WebSocket client connected");
    clients.add(ws);

    ws.on("message", (data) => {
      try {
        const message = JSON.parse(data.toString());
        console.log("Received:", message);
        // Handle incoming messages here
      } catch (err) {
        console.error("Invalid WebSocket message:", err);
      }
    });

    ws.on("close", () => {
      console.log("WebSocket client disconnected");
      clients.delete(ws);
    });

    ws.on("error", (err) => {
      console.error("WebSocket error:", err);
      clients.delete(ws);
    });

    // Send welcome message
    const welcome: WSMessage<{ connected: true }> = {
      type: "project:created", // Using existing type for now
      payload: { connected: true },
      timestamp: new Date().toISOString(),
    };
    ws.send(JSON.stringify(welcome));
  });

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log(`> WebSocket on ws://${hostname}:${port}/ws`);
  });
});
