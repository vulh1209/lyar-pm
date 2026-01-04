import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";

type Params = { params: Promise<{ id: string }> };

// GET /api/sessions/:id - Get a single session with messages
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const [session] = await db
      .select()
      .from(schema.sessions)
      .where(eq(schema.sessions.id, id));

    if (!session) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Session not found" } },
        { status: 404 }
      );
    }

    // Get messages for this session
    const messages = await db
      .select()
      .from(schema.messages)
      .where(eq(schema.messages.session_id, id));

    return NextResponse.json({ data: { ...session, messages } });
  } catch (error) {
    console.error("Failed to fetch session:", error);
    return NextResponse.json(
      { error: { code: "FETCH_FAILED", message: "Failed to fetch session" } },
      { status: 500 }
    );
  }
}

// PATCH /api/sessions/:id - Update a session
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, claude_session_id, conversation_history } = body;

    const [existing] = await db
      .select()
      .from(schema.sessions)
      .where(eq(schema.sessions.id, id));

    if (!existing) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Session not found" } },
        { status: 404 }
      );
    }

    const now = new Date().toISOString();
    const [session] = await db
      .update(schema.sessions)
      .set({
        ...(status !== undefined && { status }),
        ...(claude_session_id !== undefined && { claude_session_id }),
        ...(conversation_history !== undefined && { conversation_history }),
        updated_at: now,
      })
      .where(eq(schema.sessions.id, id))
      .returning();

    return NextResponse.json({ data: session });
  } catch (error) {
    console.error("Failed to update session:", error);
    return NextResponse.json(
      { error: { code: "UPDATE_FAILED", message: "Failed to update session" } },
      { status: 500 }
    );
  }
}

// DELETE /api/sessions/:id - Delete a session
export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const [existing] = await db
      .select()
      .from(schema.sessions)
      .where(eq(schema.sessions.id, id));

    if (!existing) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Session not found" } },
        { status: 404 }
      );
    }

    await db.delete(schema.sessions).where(eq(schema.sessions.id, id));

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    console.error("Failed to delete session:", error);
    return NextResponse.json(
      { error: { code: "DELETE_FAILED", message: "Failed to delete session" } },
      { status: 500 }
    );
  }
}
