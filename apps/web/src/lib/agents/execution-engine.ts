import type { AgentRole } from "@lyar/types";
import type { AgentContext, AgentResult, NextStep, Message } from "./types";
import { pmAgent } from "./pm-agent";
import { getAgent } from "./specialized-agents";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { generateId } from "@lyar/utils";

/**
 * Agent Execution Engine
 * Orchestrates agent execution and manages task flow
 */
export class ExecutionEngine {
  private taskQueue: NextStep[] = [];
  private isRunning = false;

  /**
   * Execute a user message through the PM agent
   */
  async executeUserMessage(
    sessionId: string,
    featureId: string,
    userMessage: string
  ): Promise<AgentResult> {
    // Get session and project info
    const [session] = await db
      .select()
      .from(schema.sessions)
      .where(eq(schema.sessions.id, sessionId));

    if (!session) {
      return { success: false, output: "", error: "Session not found" };
    }

    const [feature] = await db
      .select()
      .from(schema.features)
      .where(eq(schema.features.id, featureId));

    if (!feature) {
      return { success: false, output: "", error: "Feature not found" };
    }

    const [project] = await db
      .select()
      .from(schema.projects)
      .where(eq(schema.projects.id, feature.project_id));

    if (!project) {
      return { success: false, output: "", error: "Project not found" };
    }

    // Get conversation history
    const messages = await db
      .select()
      .from(schema.messages)
      .where(eq(schema.messages.session_id, sessionId));

    const conversationHistory: Message[] = messages.map((m) => ({
      role: m.role as Message["role"],
      content: m.content,
    }));

    // Create context
    const context: AgentContext = {
      projectId: project.id,
      projectPath: project.path,
      featureId: feature.id,
      sessionId: session.id,
      conversationHistory,
    };

    // Execute PM agent
    const result = await pmAgent.processMessage(context, userMessage);

    // Queue next steps if any
    if (result.nextSteps) {
      this.taskQueue.push(...result.nextSteps);
    }

    // Store artifacts if any
    if (result.artifacts) {
      for (const artifact of result.artifacts) {
        await this.storeArtifact(project.id, feature.id, artifact);
      }
    }

    return result;
  }

  /**
   * Execute a specific agent task
   */
  async executeAgentTask(
    role: AgentRole,
    context: AgentContext,
    task: string
  ): Promise<AgentResult> {
    if (role === "pm") {
      return pmAgent.processMessage(context, task);
    }

    const agent = getAgent(role);
    return agent.execute(context, task);
  }

  /**
   * Process the task queue
   */
  async processQueue(context: AgentContext): Promise<void> {
    if (this.isRunning || this.taskQueue.length === 0) return;

    this.isRunning = true;

    try {
      while (this.taskQueue.length > 0) {
        const nextTask = this.taskQueue.shift()!;

        // Create task record
        const taskId = generateId("task");
        const now = new Date().toISOString();

        await db.insert(schema.tasks).values({
          id: taskId,
          feature_id: context.featureId,
          title: nextTask.task,
          status: "running",
          agent_role: nextTask.agentRole,
          started_at: now,
          created_at: now,
          updated_at: now,
        });

        try {
          // Execute task
          const result = await this.executeAgentTask(
            nextTask.agentRole,
            context,
            nextTask.task
          );

          // Update task with result
          await db
            .update(schema.tasks)
            .set({
              status: result.success ? "completed" : "failed",
              output: result.output,
              error: result.error,
              completed_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .where(eq(schema.tasks.id, taskId));

          // Queue additional steps
          if (result.nextSteps) {
            this.taskQueue.push(...result.nextSteps);
          }

          // Store artifacts
          if (result.artifacts) {
            for (const artifact of result.artifacts) {
              await this.storeArtifact(
                context.projectId,
                context.featureId,
                artifact
              );
            }
          }
        } catch (error) {
          // Mark task as failed
          await db
            .update(schema.tasks)
            .set({
              status: "failed",
              error: error instanceof Error ? error.message : "Unknown error",
              completed_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .where(eq(schema.tasks.id, taskId));
        }
      }
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Store an artifact
   */
  private async storeArtifact(
    projectId: string,
    featureId: string,
    artifact: { type: string; path: string; content: string }
  ): Promise<void> {
    // For now, just log - in production would write to file system
    console.log(`Storing artifact: ${artifact.path}`);
    // TODO: Actually write file to project path
  }

  /**
   * Get current queue status
   */
  getQueueStatus(): { pending: number; running: boolean } {
    return {
      pending: this.taskQueue.length,
      running: this.isRunning,
    };
  }

  /**
   * Clear the task queue
   */
  clearQueue(): void {
    this.taskQueue = [];
  }
}

// Singleton instance
export const executionEngine = new ExecutionEngine();
