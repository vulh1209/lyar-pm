export interface Task {
  id: string;
  featureId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  agentRole: AgentRole;
  sessionId: string | null;
  output: string | null;
  error: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus =
  | "pending"
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export type AgentRole =
  | "pm"
  | "architect"
  | "frontend"
  | "backend"
  | "qa"
  | "devops";

export interface CreateTaskInput {
  featureId: string;
  title: string;
  description?: string;
  agentRole: AgentRole;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  output?: string;
  error?: string;
}
