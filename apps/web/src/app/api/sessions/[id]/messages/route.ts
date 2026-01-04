import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { generateId } from "@lyar/utils";
import { eq, asc } from "drizzle-orm";

type Params = { params: Promise<{ id: string }> };

// GET /api/sessions/:id/messages - List all messages for a session
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id: sessionId } = await params;

    // Verify session exists
    const [session] = await db
      .select()
      .from(schema.sessions)
      .where(eq(schema.sessions.id, sessionId));

    if (!session) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Session not found" } },
        { status: 404 }
      );
    }

    const messages = await db
      .select()
      .from(schema.messages)
      .where(eq(schema.messages.session_id, sessionId))
      .orderBy(asc(schema.messages.timestamp));

    return NextResponse.json({
      data: messages,
      meta: { total: messages.length },
    });
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return NextResponse.json(
      { error: { code: "FETCH_FAILED", message: "Failed to fetch messages" } },
      { status: 500 }
    );
  }
}

// POST /api/sessions/:id/messages - Add a message to a session
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id: sessionId } = await params;
    const body = await request.json();
    const { role, content } = body;

    if (!role || !content) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Role and content are required",
          },
        },
        { status: 400 }
      );
    }

    // Verify session exists
    const [session] = await db
      .select()
      .from(schema.sessions)
      .where(eq(schema.sessions.id, sessionId));

    if (!session) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Session not found" } },
        { status: 404 }
      );
    }

    const now = new Date().toISOString();
    const id = generateId("message");

    const [message] = await db
      .insert(schema.messages)
      .values({
        id,
        session_id: sessionId,
        role,
        content,
        timestamp: now,
      })
      .returning();

    return NextResponse.json({ data: message }, { status: 201 });
  } catch (error) {
    console.error("Failed to create message:", error);
    return NextResponse.json(
      { error: { code: "CREATE_FAILED", message: "Failed to create message" } },
      { status: 500 }
    );
  }
}
