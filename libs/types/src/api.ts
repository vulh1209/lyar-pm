// API Response wrapper types
export interface ApiResponse<T> {
  data: T;
  meta?: ApiMeta;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface ApiMeta {
  total?: number;
  page?: number;
  limit?: number;
}

// WebSocket message types
export type WSEventType =
  | "project:created"
  | "project:updated"
  | "project:deleted"
  | "feature:created"
  | "feature:updated"
  | "feature:deleted"
  | "task:started"
  | "task:streaming"
  | "task:completed"
  | "task:failed"
  | "session:message";

export interface WSMessage<T = unknown> {
  type: WSEventType;
  payload: T;
  timestamp: string;
}
