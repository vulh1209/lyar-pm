"use client";

import { useEffect, useCallback, useState } from "react";
import { wsClient } from "@/lib/ws/client";
import type { WSMessage, WSEventType } from "@lyar/types";

interface UseWebSocketOptions {
  autoConnect?: boolean;
}

export function useWebSocket(options: UseWebSocketOptions = { autoConnect: true }) {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (options.autoConnect) {
      wsClient.connect();
    }

    const unsubConnect = wsClient.on("*", (message) => {
      if (message.type === "project:created" && (message.payload as any)?.connected) {
        setConnected(true);
      }
    });

    return () => {
      unsubConnect();
    };
  }, [options.autoConnect]);

  const subscribe = useCallback(
    <T>(type: WSEventType | "*", callback: (payload: T) => void) => {
      return wsClient.on(type, (message: WSMessage) => {
        callback(message.payload as T);
      });
    },
    []
  );

  const send = useCallback(<T>(type: WSEventType, payload: T) => {
    wsClient.send(type, payload);
  }, []);

  return {
    connected,
    subscribe,
    send,
  };
}

// Typed event hooks
export function useTaskEvents(
  onTaskStarted?: (task: any) => void,
  onTaskCompleted?: (task: any) => void,
  onTaskFailed?: (task: any) => void,
  onTaskStreaming?: (data: any) => void
) {
  const { subscribe } = useWebSocket();

  useEffect(() => {
    const unsubs: (() => void)[] = [];

    if (onTaskStarted) {
      unsubs.push(subscribe("task:started", onTaskStarted));
    }
    if (onTaskCompleted) {
      unsubs.push(subscribe("task:completed", onTaskCompleted));
    }
    if (onTaskFailed) {
      unsubs.push(subscribe("task:failed", onTaskFailed));
    }
    if (onTaskStreaming) {
      unsubs.push(subscribe("task:streaming", onTaskStreaming));
    }

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, [subscribe, onTaskStarted, onTaskCompleted, onTaskFailed, onTaskStreaming]);
}

export function useSessionEvents(onMessage?: (message: any) => void) {
  const { subscribe } = useWebSocket();

  useEffect(() => {
    if (!onMessage) return;

    const unsub = subscribe("session:message", onMessage);
    return unsub;
  }, [subscribe, onMessage]);
}
