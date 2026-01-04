import type { AgentRole } from "@lyar/types";

export interface AgentContext {
  projectId: string;
  projectPath: string;
  featureId: string;
  sessionId: string;
  conversationHistory: Message[];
}

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AgentResult {
  success: boolean;
  output: string;
  artifacts?: Artifact[];
  nextSteps?: NextStep[];
  error?: string;
}

export interface Artifact {
  type: "prd" | "schema" | "code" | "test" | "config" | "doc";
  path: string;
  content: string;
}

export interface NextStep {
  agentRole: AgentRole;
  task: string;
  priority: number;
  dependencies?: string[];
}

export interface ApprovalRequest {
  id: string;
  type: "prd" | "design" | "code" | "deploy";
  title: string;
  description: string;
  details: string;
  options: ApprovalOption[];
}

export interface ApprovalOption {
  id: string;
  label: string;
  action: "approve" | "modify" | "reject";
}

export interface AgentExecutionOptions {
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
}
