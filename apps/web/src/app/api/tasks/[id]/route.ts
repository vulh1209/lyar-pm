import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";

type Params = { params: Promise<{ id: string }> };

// GET /api/tasks/:id - Get a single task
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const [task] = await db
      .select()
      .from(schema.tasks)
      .where(eq(schema.tasks.id, id));

    if (!task) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Task not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: task });
  } catch (error) {
    console.error("Failed to fetch task:", error);
    return NextResponse.json(
      { error: { code: "FETCH_FAILED", message: "Failed to fetch task" } },
      { status: 500 }
    );
  }
}

// PATCH /api/tasks/:id - Update a task
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, status, output, error: taskError, session_id } = body;

    const [existing] = await db
      .select()
      .from(schema.tasks)
      .where(eq(schema.tasks.id, id));

    if (!existing) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Task not found" } },
        { status: 404 }
      );
    }

    const now = new Date().toISOString();

    // Determine additional fields based on status change
    const additionalFields: Record<string, string> = {};
    if (status === "running" && existing.status !== "running") {
      additionalFields.started_at = now;
    }
    if ((status === "completed" || status === "failed") &&
        existing.status !== "completed" && existing.status !== "failed") {
      additionalFields.completed_at = now;
    }

    const [task] = await db
      .update(schema.tasks)
      .set({
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        ...(output !== undefined && { output }),
        ...(taskError !== undefined && { error: taskError }),
        ...(session_id !== undefined && { session_id }),
        ...additionalFields,
        updated_at: now,
      })
      .where(eq(schema.tasks.id, id))
      .returning();

    return NextResponse.json({ data: task });
  } catch (error) {
    console.error("Failed to update task:", error);
    return NextResponse.json(
      { error: { code: "UPDATE_FAILED", message: "Failed to update task" } },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/:id - Delete a task
export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const [existing] = await db
      .select()
      .from(schema.tasks)
      .where(eq(schema.tasks.id, id));

    if (!existing) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Task not found" } },
        { status: 404 }
      );
    }

    await db.delete(schema.tasks).where(eq(schema.tasks.id, id));

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    console.error("Failed to delete task:", error);
    return NextResponse.json(
      { error: { code: "DELETE_FAILED", message: "Failed to delete task" } },
      { status: 500 }
    );
  }
}
