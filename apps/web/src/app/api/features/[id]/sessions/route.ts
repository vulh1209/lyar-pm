import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { generateId } from "@lyar/utils";
import { eq, desc } from "drizzle-orm";

type Params = { params: Promise<{ id: string }> };

// GET /api/features/:id/sessions - List all sessions for a feature
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id: featureId } = await params;

    // Verify feature exists
    const [feature] = await db
      .select()
      .from(schema.features)
      .where(eq(schema.features.id, featureId));

    if (!feature) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Feature not found" } },
        { status: 404 }
      );
    }

    const sessions = await db
      .select()
      .from(schema.sessions)
      .where(eq(schema.sessions.feature_id, featureId))
      .orderBy(desc(schema.sessions.created_at));

    return NextResponse.json({
      data: sessions,
      meta: { total: sessions.length },
    });
  } catch (error) {
    console.error("Failed to fetch sessions:", error);
    return NextResponse.json(
      { error: { code: "FETCH_FAILED", message: "Failed to fetch sessions" } },
      { status: 500 }
    );
  }
}

// POST /api/features/:id/sessions - Create a new session
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id: featureId } = await params;
    const body = await request.json();
    const { task_id } = body;

    // Verify feature exists
    const [feature] = await db
      .select()
      .from(schema.features)
      .where(eq(schema.features.id, featureId));

    if (!feature) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Feature not found" } },
        { status: 404 }
      );
    }

    // Verify task exists if provided
    if (task_id) {
      const [task] = await db
        .select()
        .from(schema.tasks)
        .where(eq(schema.tasks.id, task_id));

      if (!task) {
        return NextResponse.json(
          { error: { code: "NOT_FOUND", message: "Task not found" } },
          { status: 404 }
        );
      }
    }

    const now = new Date().toISOString();
    const id = generateId("session");

    const [session] = await db
      .insert(schema.sessions)
      .values({
        id,
        feature_id: featureId,
        task_id: task_id || null,
        status: "active",
        created_at: now,
        updated_at: now,
      })
      .returning();

    return NextResponse.json({ data: session }, { status: 201 });
  } catch (error) {
    console.error("Failed to create session:", error);
    return NextResponse.json(
      { error: { code: "CREATE_FAILED", message: "Failed to create session" } },
      { status: 500 }
    );
  }
}
