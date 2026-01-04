import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { generateId } from "@lyar/utils";
import { eq, desc } from "drizzle-orm";

// GET /api/projects - List all projects
export async function GET() {
  try {
    const projects = await db
      .select()
      .from(schema.projects)
      .orderBy(desc(schema.projects.created_at));

    return NextResponse.json({
      data: projects,
      meta: { total: projects.length },
    });
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return NextResponse.json(
      { error: { code: "FETCH_FAILED", message: "Failed to fetch projects" } },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, path } = body;

    if (!name || !path) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Name and path are required",
          },
        },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const id = generateId("project");

    const [project] = await db
      .insert(schema.projects)
      .values({
        id,
        name,
        description: description || null,
        path,
        status: "active",
        created_at: now,
        updated_at: now,
      })
      .returning();

    return NextResponse.json({ data: project }, { status: 201 });
  } catch (error) {
    console.error("Failed to create project:", error);
    return NextResponse.json(
      { error: { code: "CREATE_FAILED", message: "Failed to create project" } },
      { status: 500 }
    );
  }
}
