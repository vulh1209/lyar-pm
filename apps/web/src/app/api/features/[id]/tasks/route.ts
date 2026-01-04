import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { generateId } from "@lyar/utils";
import { eq, desc } from "drizzle-orm";

type Params = { params: Promise<{ id: string }> };

// GET /api/features/:id/tasks - List all tasks for a feature
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

    const tasks = await db
      .select()
      .from(schema.tasks)
      .where(eq(schema.tasks.feature_id, featureId))
      .orderBy(desc(schema.tasks.created_at));

    return NextResponse.json({
      data: tasks,
      meta: { total: tasks.length },
    });
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    return NextResponse.json(
      { error: { code: "FETCH_FAILED", message: "Failed to fetch tasks" } },
      { status: 500 }
    );
  }
}

// POST /api/features/:id/tasks - Create a new task
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id: featureId } = await params;
    const body = await request.json();
    const { title, description, agent_role } = body;

    if (!title || !agent_role) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Title and agent_role are required",
          },
        },
        { status: 400 }
      );
    }

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

    const now = new Date().toISOString();
    const id = generateId("task");

    const [task] = await db
      .insert(schema.tasks)
      .values({
        id,
        feature_id: featureId,
        title,
        description: description || null,
        status: "pending",
        agent_role,
        created_at: now,
        updated_at: now,
      })
      .returning();

    return NextResponse.json({ data: task }, { status: 201 });
  } catch (error) {
    console.error("Failed to create task:", error);
    return NextResponse.json(
      { error: { code: "CREATE_FAILED", message: "Failed to create task" } },
      { status: 500 }
    );
  }
}
