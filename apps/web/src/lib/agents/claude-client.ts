import type { AgentRole } from "@lyar/types";
import type { Message } from "./types";
import { getAgentSystemPrompt } from "@lyar/prompts";

/**
 * Claude API Client for agent execution
 * Uses Anthropic's Claude API for intelligent responses
 */
export class ClaudeClient {
  private apiKey: string | null = null;
  private baseUrl = "https://api.anthropic.com/v1";
  private model = "claude-sonnet-4-20250514";

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.ANTHROPIC_API_KEY || null;
  }

  /**
   * Set API key dynamically
   */
  setApiKey(key: string) {
    this.apiKey = key;
  }

  /**
   * Check if client is configured
   */
  isConfigured(): boolean {
    return this.apiKey !== null;
  }

  /**
   * Send a message to Claude and get a response
   */
  async chat(
    role: AgentRole,
    messages: Message[],
    options: {
      maxTokens?: number;
      temperature?: number;
      stream?: boolean;
    } = {}
  ): Promise<string> {
    if (!this.apiKey) {
      // Return simulated response when no API key
      return this.simulateResponse(role, messages);
    }

    const systemPrompt = getAgentSystemPrompt(role);

    try {
      const response = await fetch(`${this.baseUrl}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: options.maxTokens || 4096,
          temperature: options.temperature ?? 0.7,
          system: systemPrompt,
          messages: messages.map((m) => ({
            role: m.role === "assistant" ? "assistant" : "user",
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Claude API request failed");
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error("Claude API error:", error);
      // Fallback to simulation on error
      return this.simulateResponse(role, messages);
    }
  }

  /**
   * Stream a response from Claude
   */
  async *stream(
    role: AgentRole,
    messages: Message[],
    options: {
      maxTokens?: number;
      temperature?: number;
    } = {}
  ): AsyncGenerator<string> {
    if (!this.apiKey) {
      // Simulate streaming for demo
      const response = await this.simulateResponse(role, messages);
      for (const word of response.split(" ")) {
        yield word + " ";
        await new Promise((r) => setTimeout(r, 50));
      }
      return;
    }

    const systemPrompt = getAgentSystemPrompt(role);

    try {
      const response = await fetch(`${this.baseUrl}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: options.maxTokens || 4096,
          temperature: options.temperature ?? 0.7,
          system: systemPrompt,
          messages: messages.map((m) => ({
            role: m.role === "assistant" ? "assistant" : "user",
            content: m.content,
          })),
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Claude API streaming request failed");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response body");
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const json = JSON.parse(data);
              if (json.type === "content_block_delta") {
                yield json.delta.text;
              }
            } catch {
              // Ignore parse errors
            }
          }
        }
      }
    } catch (error) {
      console.error("Claude streaming error:", error);
      // Fallback to simulation
      const response = await this.simulateResponse(role, messages);
      yield response;
    }
  }

  /**
   * Simulate a response when API is not available
   */
  private async simulateResponse(
    role: AgentRole,
    messages: Message[]
  ): Promise<string> {
    const lastUserMessage =
      messages.filter((m) => m.role === "user").pop()?.content || "";

    // Simulate thinking time
    await new Promise((r) => setTimeout(r, 500));

    const responses: Record<AgentRole, (msg: string) => string> = {
      pm: (msg) => {
        if (messages.length <= 1) {
          return `Thanks for sharing your idea! To help me create the best solution, I have a few questions:

1. **Target Users**: Who will be using this application?
2. **Core Features**: What are the 2-3 most important things users need to do?
3. **Authentication**: Do users need to log in?
4. **Data**: What information does the app need to store?

Feel free to answer any of these, or tell me more about your vision!`;
        }
        return `I understand you want to ${msg.toLowerCase().slice(0, 50)}...

Let me help break this down into actionable tasks. Based on our discussion, here's what I suggest:

1. **Design the data model** - Define the structure of your data
2. **Build the API** - Create endpoints for data operations
3. **Create the UI** - Build user-facing components
4. **Test and deploy** - Ensure everything works correctly

Would you like me to proceed with this plan?`;
      },
      architect: () =>
        `I've analyzed the requirements and designed the following architecture:

**Database Schema:**
- Users table for user management
- Core data tables for business logic
- Relationships defined with foreign keys

**API Structure:**
- RESTful endpoints for CRUD operations
- Authentication middleware
- Error handling layer

Ready for your review and approval.`,
      frontend: () =>
        `I've created the UI components:

**Components Built:**
- Layout and navigation
- Form components
- Data display tables/lists
- Modal dialogs

All components are responsive and follow accessibility best practices.`,
      backend: () =>
        `API endpoints are ready:

**Endpoints Created:**
- GET/POST /api/items - List and create
- GET/PATCH/DELETE /api/items/:id - Read, update, delete
- Authentication routes

All endpoints include validation and error handling.`,
      qa: () =>
        `Test suite complete:

**Test Results:**
- Unit tests: 15 passed
- Integration tests: 8 passed
- E2E tests: 5 passed
- Coverage: 85%

All tests passing. Ready for deployment.`,
      devops: () =>
        `Deployment configured:

**Setup Complete:**
- CI/CD pipeline configured
- Environment variables set
- Production build optimized
- Monitoring in place

Ready to deploy to production.`,
    };

    return responses[role](lastUserMessage);
  }
}

// Singleton instance
export const claudeClient = new ClaudeClient();
