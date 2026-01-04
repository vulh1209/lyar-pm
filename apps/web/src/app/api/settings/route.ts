import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";

// GET /api/settings - Get all settings
export async function GET() {
  try {
    const settings = await db.select().from(schema.settings);

    // Convert array to key-value object
    const settingsMap = settings.reduce(
      (acc, s) => ({ ...acc, [s.key]: s.value }),
      {} as Record<string, string>
    );

    return NextResponse.json({ data: settingsMap });
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return NextResponse.json(
      { error: { code: "FETCH_FAILED", message: "Failed to fetch settings" } },
      { status: 500 }
    );
  }
}

// PUT /api/settings - Update settings (upsert)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const now = new Date().toISOString();

    // Update each setting
    for (const [key, value] of Object.entries(body)) {
      if (typeof value !== "string") continue;

      const [existing] = await db
        .select()
        .from(schema.settings)
        .where(eq(schema.settings.key, key));

      if (existing) {
        await db
          .update(schema.settings)
          .set({ value, updated_at: now })
          .where(eq(schema.settings.key, key));
      } else {
        await db.insert(schema.settings).values({
          key,
          value,
          updated_at: now,
        });
      }
    }

    // Return updated settings
    const settings = await db.select().from(schema.settings);
    const settingsMap = settings.reduce(
      (acc, s) => ({ ...acc, [s.key]: s.value }),
      {} as Record<string, string>
    );

    return NextResponse.json({ data: settingsMap });
  } catch (error) {
    console.error("Failed to update settings:", error);
    return NextResponse.json(
      { error: { code: "UPDATE_FAILED", message: "Failed to update settings" } },
      { status: 500 }
    );
  }
}
