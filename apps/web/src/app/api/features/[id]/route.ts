import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";

type Params = { params: Promise<{ id: string }> };

// GET /api/features/:id - Get a single feature
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const [feature] = await db
      .select()
      .from(schema.features)
      .where(eq(schema.features.id, id));

    if (!feature) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Feature not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: feature });
  } catch (error) {
    console.error("Failed to fetch feature:", error);
    return NextResponse.json(
      { error: { code: "FETCH_FAILED", message: "Failed to fetch feature" } },
      { status: 500 }
    );
  }
}

// PATCH /api/features/:id - Update a feature
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, status, priority, order, worktree_path, branch_name } = body;

    const [existing] = await db
      .select()
      .from(schema.features)
      .where(eq(schema.features.id, id));

    if (!existing) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Feature not found" } },
        { status: 404 }
      );
    }

    const now = new Date().toISOString();
    const [feature] = await db
      .update(schema.features)
      .set({
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        ...(priority !== undefined && { priority }),
        ...(order !== undefined && { order }),
        ...(worktree_path !== undefined && { worktree_path }),
        ...(branch_name !== undefined && { branch_name }),
        updated_at: now,
      })
      .where(eq(schema.features.id, id))
      .returning();

    return NextResponse.json({ data: feature });
  } catch (error) {
    console.error("Failed to update feature:", error);
    return NextResponse.json(
      { error: { code: "UPDATE_FAILED", message: "Failed to update feature" } },
      { status: 500 }
    );
  }
}

// DELETE /api/features/:id - Delete a feature
export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const [existing] = await db
      .select()
      .from(schema.features)
      .where(eq(schema.features.id, id));

    if (!existing) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Feature not found" } },
        { status: 404 }
      );
    }

    await db.delete(schema.features).where(eq(schema.features.id, id));

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    console.error("Failed to delete feature:", error);
    return NextResponse.json(
      { error: { code: "DELETE_FAILED", message: "Failed to delete feature" } },
      { status: 500 }
    );
  }
}
