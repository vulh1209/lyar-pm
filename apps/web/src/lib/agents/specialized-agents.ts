import type { AgentRole } from "@lyar/types";
import type { AgentContext, AgentResult, Artifact } from "./types";
import { getAgentSystemPrompt } from "@lyar/prompts";

/**
 * Base class for specialized agents
 */
abstract class SpecializedAgent {
  protected role: AgentRole;
  protected systemPrompt: string;

  constructor(role: AgentRole) {
    this.role = role;
    this.systemPrompt = getAgentSystemPrompt(role);
  }

  abstract execute(context: AgentContext, task: string): Promise<AgentResult>;

  protected createArtifact(
    type: Artifact["type"],
    path: string,
    content: string
  ): Artifact {
    return { type, path, content };
  }
}

/**
 * Architect Agent - Designs system architecture
 */
export class ArchitectAgent extends SpecializedAgent {
  constructor() {
    super("architect");
  }

  async execute(context: AgentContext, task: string): Promise<AgentResult> {
    // Generate schema design
    const schema = this.generateDatabaseSchema(context);
    const apiDesign = this.generateAPIDesign(context);

    return {
      success: true,
      output: `I've designed the system architecture:

## Database Schema
${schema}

## API Design
${apiDesign}

Ready for review. Shall I proceed with implementation?`,
      artifacts: [
        this.createArtifact("schema", "src/lib/db/schema.ts", schema),
        this.createArtifact("doc", ".lyar/api-design.md", apiDesign),
      ],
    };
  }

  private generateDatabaseSchema(context: AgentContext): string {
    return `// Generated database schema
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  created_at: text("created_at").notNull(),
});

export const items = sqliteTable("items", {
  id: text("id").primaryKey(),
  user_id: text("user_id").references(() => users.id),
  title: text("title").notNull(),
  status: text("status").notNull().default("active"),
  created_at: text("created_at").notNull(),
});
`;
  }

  private generateAPIDesign(context: AgentContext): string {
    return `# API Design

## Endpoints

### Users
- GET /api/users - List users
- GET /api/users/:id - Get user
- POST /api/users - Create user
- PATCH /api/users/:id - Update user
- DELETE /api/users/:id - Delete user

### Items
- GET /api/items - List items (with filters)
- GET /api/items/:id - Get item
- POST /api/items - Create item
- PATCH /api/items/:id - Update item
- DELETE /api/items/:id - Delete item
`;
  }
}

/**
 * Frontend Agent - Builds UI components
 */
export class FrontendAgent extends SpecializedAgent {
  constructor() {
    super("frontend");
  }

  async execute(context: AgentContext, task: string): Promise<AgentResult> {
    const component = this.generateComponent(task);

    return {
      success: true,
      output: `I've created the UI component:

\`\`\`tsx
${component}
\`\`\`

The component follows React best practices with TypeScript and Tailwind CSS.`,
      artifacts: [
        this.createArtifact(
          "code",
          `src/components/${this.getComponentName(task)}.tsx`,
          component
        ),
      ],
    };
  }

  private getComponentName(task: string): string {
    return task.split(" ")[0].toLowerCase();
  }

  private generateComponent(task: string): string {
    return `"use client";

import { useState } from "react";

interface Props {
  // Define props here
}

export function Component({ }: Props) {
  const [loading, setLoading] = useState(false);

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Component</h2>
      {/* Component content */}
    </div>
  );
}
`;
  }
}

/**
 * Backend Agent - Builds API endpoints
 */
export class BackendAgent extends SpecializedAgent {
  constructor() {
    super("backend");
  }

  async execute(context: AgentContext, task: string): Promise<AgentResult> {
    const apiRoute = this.generateAPIRoute(task);

    return {
      success: true,
      output: `I've created the API endpoint:

\`\`\`typescript
${apiRoute}
\`\`\`

The endpoint includes proper error handling and validation.`,
      artifacts: [
        this.createArtifact("code", `src/app/api/endpoint/route.ts`, apiRoute),
      ],
    };
  }

  private generateAPIRoute(task: string): string {
    return `import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const data = await db.select().from(schema.items);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to fetch data" } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Validate and create
    return NextResponse.json({ data: {} }, { status: 201 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to create" } },
      { status: 500 }
    );
  }
}
`;
  }
}

/**
 * QA Agent - Writes and runs tests
 */
export class QAAgent extends SpecializedAgent {
  constructor() {
    super("qa");
  }

  async execute(context: AgentContext, task: string): Promise<AgentResult> {
    const tests = this.generateTests(task);

    return {
      success: true,
      output: `I've created the test suite:

\`\`\`typescript
${tests}
\`\`\`

Run with: \`bun test\`

Test coverage report will be generated on completion.`,
      artifacts: [
        this.createArtifact("test", `tests/feature.test.ts`, tests),
      ],
    };
  }

  private generateTests(task: string): string {
    return `import { describe, it, expect, beforeAll, afterAll } from "bun:test";

describe("Feature Tests", () => {
  beforeAll(() => {
    // Setup
  });

  afterAll(() => {
    // Cleanup
  });

  it("should create item successfully", async () => {
    const response = await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Test Item" }),
    });

    expect(response.status).toBe(201);
    const json = await response.json();
    expect(json.data).toBeDefined();
  });

  it("should list items", async () => {
    const response = await fetch("/api/items");
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(Array.isArray(json.data)).toBe(true);
  });

  it("should handle errors gracefully", async () => {
    const response = await fetch("/api/items/invalid-id");
    expect(response.status).toBe(404);
  });
});
`;
  }
}

/**
 * DevOps Agent - Handles deployment
 */
export class DevOpsAgent extends SpecializedAgent {
  constructor() {
    super("devops");
  }

  async execute(context: AgentContext, task: string): Promise<AgentResult> {
    const config = this.generateDeployConfig();

    return {
      success: true,
      output: `I've set up the deployment configuration:

${config}

Ready to deploy to Vercel. Run:
\`\`\`bash
vercel deploy
\`\`\``,
      artifacts: [
        this.createArtifact("config", "vercel.json", config),
      ],
    };
  }

  private generateDeployConfig(): string {
    return `{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "DATABASE_URL": "@database_url"
  }
}`;
  }
}

// Factory function to get agent by role
export function getAgent(role: AgentRole): SpecializedAgent {
  const agents: Record<Exclude<AgentRole, "pm">, SpecializedAgent> = {
    architect: new ArchitectAgent(),
    frontend: new FrontendAgent(),
    backend: new BackendAgent(),
    qa: new QAAgent(),
    devops: new DevOpsAgent(),
  };

  if (role === "pm") {
    throw new Error("Use PMAgent directly for PM role");
  }

  return agents[role];
}
