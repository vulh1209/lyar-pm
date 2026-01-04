import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";

type Params = { params: Promise<{ id: string }> };

// GET /api/projects/:id - Get a single project
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const [project] = await db
      .select()
      .from(schema.projects)
      .where(eq(schema.projects.id, id));

    if (!project) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Project not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: project });
  } catch (error) {
    console.error("Failed to fetch project:", error);
    return NextResponse.json(
      { error: { code: "FETCH_FAILED", message: "Failed to fetch project" } },
      { status: 500 }
    );
  }
}

// PATCH /api/projects/:id - Update a project
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, status } = body;

    const [existing] = await db
      .select()
      .from(schema.projects)
      .where(eq(schema.projects.id, id));

    if (!existing) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Project not found" } },
        { status: 404 }
      );
    }

    const now = new Date().toISOString();
    const [project] = await db
      .update(schema.projects)
      .set({
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        updated_at: now,
      })
      .where(eq(schema.projects.id, id))
      .returning();

    return NextResponse.json({ data: project });
  } catch (error) {
    console.error("Failed to update project:", error);
    return NextResponse.json(
      { error: { code: "UPDATE_FAILED", message: "Failed to update project" } },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/:id - Delete a project
export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const [existing] = await db
      .select()
      .from(schema.projects)
      .where(eq(schema.projects.id, id));

    if (!existing) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Project not found" } },
        { status: 404 }
      );
    }

    await db.delete(schema.projects).where(eq(schema.projects.id, id));

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    console.error("Failed to delete project:", error);
    return NextResponse.json(
      { error: { code: "DELETE_FAILED", message: "Failed to delete project" } },
      { status: 500 }
    );
  }
}
