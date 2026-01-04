import { NextRequest, NextResponse } from "next/server";
import { executionEngine } from "@/lib/agents";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { generateId } from "@lyar/utils";

// POST /api/execute - Execute a user message through agents
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, featureId, message } = body;

    if (!sessionId || !featureId || !message) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "sessionId, featureId, and message are required",
          },
        },
        { status: 400 }
      );
    }

    // Save user message
    const now = new Date().toISOString();
    const userMessageId = generateId("message");

    await db.insert(schema.messages).values({
      id: userMessageId,
      session_id: sessionId,
      role: "user",
      content: message,
      timestamp: now,
    });

    // Execute through agent engine
    const result = await executionEngine.executeUserMessage(
      sessionId,
      featureId,
      message
    );

    // Save assistant response
    const assistantMessageId = generateId("message");

    await db.insert(schema.messages).values({
      id: assistantMessageId,
      session_id: sessionId,
      role: "assistant",
      content: result.output,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      data: {
        message: {
          id: assistantMessageId,
          role: "assistant",
          content: result.output,
          timestamp: new Date().toISOString(),
        },
        artifacts: result.artifacts,
        nextSteps: result.nextSteps,
        success: result.success,
      },
    });
  } catch (error) {
    console.error("Execution error:", error);
    return NextResponse.json(
      {
        error: {
          code: "EXECUTION_FAILED",
          message: error instanceof Error ? error.message : "Execution failed",
        },
      },
      { status: 500 }
    );
  }
}
