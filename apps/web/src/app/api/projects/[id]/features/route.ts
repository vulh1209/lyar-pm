import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { generateId } from "@lyar/utils";
import { eq, and, asc } from "drizzle-orm";

type Params = { params: Promise<{ id: string }> };

// GET /api/projects/:id/features - List all features for a project
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id: projectId } = await params;

    // Verify project exists
    const [project] = await db
      .select()
      .from(schema.projects)
      .where(eq(schema.projects.id, projectId));

    if (!project) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Project not found" } },
        { status: 404 }
      );
    }

    const features = await db
      .select()
      .from(schema.features)
      .where(eq(schema.features.project_id, projectId))
      .orderBy(asc(schema.features.order));

    return NextResponse.json({
      data: features,
      meta: { total: features.length },
    });
  } catch (error) {
    console.error("Failed to fetch features:", error);
    return NextResponse.json(
      { error: { code: "FETCH_FAILED", message: "Failed to fetch features" } },
      { status: 500 }
    );
  }
}

// POST /api/projects/:id/features - Create a new feature
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id: projectId } = await params;
    const body = await request.json();
    const { title, description, priority } = body;

    if (!title) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Title is required" } },
        { status: 400 }
      );
    }

    // Verify project exists
    const [project] = await db
      .select()
      .from(schema.projects)
      .where(eq(schema.projects.id, projectId));

    if (!project) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Project not found" } },
        { status: 404 }
      );
    }

    // Get max order for this project
    const existingFeatures = await db
      .select({ order: schema.features.order })
      .from(schema.features)
      .where(eq(schema.features.project_id, projectId));

    const maxOrder = existingFeatures.reduce(
      (max, f) => Math.max(max, f.order),
      -1
    );

    const now = new Date().toISOString();
    const id = generateId("feature");

    const [feature] = await db
      .insert(schema.features)
      .values({
        id,
        project_id: projectId,
        title,
        description: description || null,
        status: "backlog",
        priority: priority || "medium",
        order: maxOrder + 1,
        created_at: now,
        updated_at: now,
      })
      .returning();

    return NextResponse.json({ data: feature }, { status: 201 });
  } catch (error) {
    console.error("Failed to create feature:", error);
    return NextResponse.json(
      { error: { code: "CREATE_FAILED", message: "Failed to create feature" } },
      { status: 500 }
    );
  }
}
