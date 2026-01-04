export interface Session {
  id: string;
  featureId: string;
  taskId: string | null;
  claudeSessionId: string | null;
  status: SessionStatus;
  conversationHistory: string | null;
  createdAt: string;
  updatedAt: string;
}

export type SessionStatus = "active" | "paused" | "completed" | "failed";

export interface CreateSessionInput {
  featureId: string;
  taskId?: string;
}

export interface Message {
  id: string;
  sessionId: string;
  role: MessageRole;
  content: string;
  timestamp: string;
}

export type MessageRole = "user" | "assistant" | "system";
