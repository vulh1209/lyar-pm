import type { AgentContext, AgentResult, NextStep, ApprovalRequest } from "./types";
import { getAgentSystemPrompt } from "@lyar/prompts";

/**
 * PM Agent - The orchestrator that coordinates all other agents
 */
export class PMAgent {
  private systemPrompt: string;

  constructor() {
    this.systemPrompt = getAgentSystemPrompt("pm");
  }

  /**
   * Process user message and determine next action
   */
  async processMessage(
    context: AgentContext,
    userMessage: string
  ): Promise<AgentResult> {
    const phase = this.determinePhase(context, userMessage);

    switch (phase) {
      case "discovery":
        return this.handleDiscovery(context, userMessage);
      case "planning":
        return this.handlePlanning(context, userMessage);
      case "execution":
        return this.handleExecution(context, userMessage);
      case "review":
        return this.handleReview(context, userMessage);
      default:
        return this.handleGeneral(context, userMessage);
    }
  }

  /**
   * Determine which phase of the project we're in
   */
  private determinePhase(
    context: AgentContext,
    message: string
  ): "discovery" | "planning" | "execution" | "review" | "general" {
    const history = context.conversationHistory;

    // If no history, we're in discovery
    if (history.length === 0) {
      return "discovery";
    }

    // Check for keywords indicating phase
    const lowerMessage = message.toLowerCase();

    if (
      lowerMessage.includes("approve") ||
      lowerMessage.includes("looks good") ||
      lowerMessage.includes("yes")
    ) {
      return "execution";
    }

    if (
      lowerMessage.includes("change") ||
      lowerMessage.includes("modify") ||
      lowerMessage.includes("update")
    ) {
      return "planning";
    }

    if (
      lowerMessage.includes("review") ||
      lowerMessage.includes("check") ||
      lowerMessage.includes("test")
    ) {
      return "review";
    }

    // Default: continue discovery to gather more info
    return "discovery";
  }

  /**
   * Discovery phase: gather requirements
   */
  private async handleDiscovery(
    context: AgentContext,
    userMessage: string
  ): Promise<AgentResult> {
    // Generate clarifying questions or create initial PRD
    const hasEnoughInfo = this.hasEnoughRequirements(context, userMessage);

    if (hasEnoughInfo) {
      const prd = this.generatePRD(context, userMessage);
      return {
        success: true,
        output: `I've analyzed your requirements and created a Product Requirements Document:\n\n${prd}\n\nWould you like me to proceed with this plan? You can:\n- [Approve] to start development\n- [Modify] to make changes\n- Ask me any questions`,
        artifacts: [
          {
            type: "prd",
            path: ".lyar/prd.md",
            content: prd,
          },
        ],
      };
    }

    // Generate clarifying questions
    const questions = this.generateClarifyingQuestions(context, userMessage);
    return {
      success: true,
      output: questions,
    };
  }

  /**
   * Planning phase: break down into tasks
   */
  private async handlePlanning(
    context: AgentContext,
    userMessage: string
  ): Promise<AgentResult> {
    const tasks = this.generateTaskBreakdown(context);
    const nextSteps: NextStep[] = tasks.map((task, index) => ({
      agentRole: task.agent,
      task: task.description,
      priority: index + 1,
    }));

    return {
      success: true,
      output: `Here's the development plan:\n\n${this.formatTasks(tasks)}\n\nShall I start with the first task?`,
      nextSteps,
    };
  }

  /**
   * Execution phase: delegate to specialized agents
   */
  private async handleExecution(
    context: AgentContext,
    userMessage: string
  ): Promise<AgentResult> {
    return {
      success: true,
      output:
        "Starting development! I'll coordinate the team and keep you updated on progress.\n\n" +
        "First, I'm assigning the Architect agent to design the system structure...",
      nextSteps: [
        {
          agentRole: "architect",
          task: "Design system architecture and database schema",
          priority: 1,
        },
      ],
    };
  }

  /**
   * Review phase: validate work
   */
  private async handleReview(
    context: AgentContext,
    userMessage: string
  ): Promise<AgentResult> {
    return {
      success: true,
      output: "Initiating review process...\n\nI'll have the QA agent run tests and verify the implementation.",
      nextSteps: [
        {
          agentRole: "qa",
          task: "Run test suite and generate coverage report",
          priority: 1,
        },
      ],
    };
  }

  /**
   * General conversation
   */
  private async handleGeneral(
    context: AgentContext,
    userMessage: string
  ): Promise<AgentResult> {
    return {
      success: true,
      output: `I understand. Let me help you with that.\n\nCould you tell me more about what specific aspect you'd like to focus on?`,
    };
  }

  /**
   * Check if we have enough requirements to generate PRD
   */
  private hasEnoughRequirements(
    context: AgentContext,
    message: string
  ): boolean {
    const totalContent = context.conversationHistory
      .map((m) => m.content)
      .join(" ")
      .concat(" ", message);

    // Simple heuristic: enough if description is substantial
    return totalContent.length > 100;
  }

  /**
   * Generate clarifying questions
   */
  private generateClarifyingQuestions(
    context: AgentContext,
    message: string
  ): string {
    return `Thanks for sharing your idea! To help me create the best solution, I have a few questions:

1. **Target Users**: Who will be using this application? (e.g., customers, employees, general public)

2. **Core Features**: What are the 2-3 most important things users need to do?

3. **Authentication**: Do users need to log in? If so, how? (email, social login, phone)

4. **Data**: What information does the app need to store?

5. **Integrations**: Any external services needed? (payments, SMS, email, etc.)

Feel free to answer as many as you'd like, or just describe more about your vision!`;
  }

  /**
   * Generate PRD from requirements
   */
  private generatePRD(context: AgentContext, message: string): string {
    const allContent = context.conversationHistory
      .filter((m) => m.role === "user")
      .map((m) => m.content)
      .concat(message)
      .join("\n");

    return `# Product Requirements Document

## Project Overview
${this.extractOverview(allContent)}

## Target Users
- Primary: End users of the application
- Secondary: Administrators (if applicable)

## Core Features

### P0 - Must Have
1. User-facing interface
2. Data management
3. Core business logic

### P1 - Should Have
1. Admin dashboard
2. Notifications
3. Search/Filter functionality

## Technical Requirements
- **Frontend**: Next.js with React
- **Backend**: Next.js API Routes
- **Database**: SQLite (development) / PostgreSQL (production)
- **Styling**: Tailwind CSS

## Success Criteria
- [ ] Users can complete primary workflow
- [ ] Application is responsive (mobile-friendly)
- [ ] All data is properly validated
- [ ] Error handling is comprehensive

## Out of Scope (for MVP)
- Advanced analytics
- Third-party integrations
- Mobile native apps

## Timeline Estimate
- Phase 1: Setup & Core (2-3 days)
- Phase 2: Features (3-5 days)
- Phase 3: Polish & Deploy (1-2 days)
`;
  }

  /**
   * Extract project overview from content
   */
  private extractOverview(content: string): string {
    // Take first substantial sentence as overview
    const sentences = content.split(/[.!?]/);
    const substantial = sentences.find((s) => s.trim().length > 20);
    return substantial?.trim() || "A web application built with modern technologies.";
  }

  /**
   * Generate task breakdown
   */
  private generateTaskBreakdown(
    context: AgentContext
  ): Array<{ agent: "architect" | "frontend" | "backend" | "qa" | "devops"; description: string }> {
    return [
      { agent: "architect", description: "Design database schema and API structure" },
      { agent: "backend", description: "Implement API endpoints" },
      { agent: "frontend", description: "Build UI components" },
      { agent: "qa", description: "Write and run tests" },
      { agent: "devops", description: "Setup deployment pipeline" },
    ];
  }

  /**
   * Format tasks for display
   */
  private formatTasks(
    tasks: Array<{ agent: string; description: string }>
  ): string {
    return tasks
      .map(
        (t, i) =>
          `${i + 1}. **${t.agent.charAt(0).toUpperCase() + t.agent.slice(1)}**: ${t.description}`
      )
      .join("\n");
  }

  /**
   * Create an approval request
   */
  createApprovalRequest(
    type: ApprovalRequest["type"],
    title: string,
    details: string
  ): ApprovalRequest {
    return {
      id: `approval_${Date.now()}`,
      type,
      title,
      description: `Approval needed for: ${title}`,
      details,
      options: [
        { id: "approve", label: "Approve", action: "approve" },
        { id: "modify", label: "Request Changes", action: "modify" },
        { id: "reject", label: "Reject", action: "reject" },
      ],
    };
  }
}

// Singleton instance
export const pmAgent = new PMAgent();
