import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Projects table
export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  path: text("path").notNull(),
  status: text("status", { enum: ["active", "archived", "completed"] })
    .notNull()
    .default("active"),
  created_at: text("created_at").notNull(),
  updated_at: text("updated_at").notNull(),
});

// Features table
export const features = sqliteTable("features", {
  id: text("id").primaryKey(),
  project_id: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status", {
    enum: ["backlog", "ready", "in_progress", "review", "done", "archived"],
  })
    .notNull()
    .default("backlog"),
  priority: text("priority", { enum: ["low", "medium", "high", "critical"] })
    .notNull()
    .default("medium"),
  worktree_path: text("worktree_path"),
  branch_name: text("branch_name"),
  order: integer("order").notNull().default(0),
  created_at: text("created_at").notNull(),
  updated_at: text("updated_at").notNull(),
});

// Tasks table
export const tasks = sqliteTable("tasks", {
  id: text("id").primaryKey(),
  feature_id: text("feature_id")
    .notNull()
    .references(() => features.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status", {
    enum: ["pending", "queued", "running", "completed", "failed", "cancelled"],
  })
    .notNull()
    .default("pending"),
  agent_role: text("agent_role", {
    enum: ["pm", "architect", "frontend", "backend", "qa", "devops"],
  }).notNull(),
  session_id: text("session_id"),
  output: text("output"),
  error: text("error"),
  started_at: text("started_at"),
  completed_at: text("completed_at"),
  created_at: text("created_at").notNull(),
  updated_at: text("updated_at").notNull(),
});

// Sessions table
export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  feature_id: text("feature_id")
    .notNull()
    .references(() => features.id, { onDelete: "cascade" }),
  task_id: text("task_id").references(() => tasks.id, { onDelete: "set null" }),
  claude_session_id: text("claude_session_id"),
  status: text("status", {
    enum: ["active", "paused", "completed", "failed"],
  })
    .notNull()
    .default("active"),
  conversation_history: text("conversation_history"),
  created_at: text("created_at").notNull(),
  updated_at: text("updated_at").notNull(),
});

// Messages table
export const messages = sqliteTable("messages", {
  id: text("id").primaryKey(),
  session_id: text("session_id")
    .notNull()
    .references(() => sessions.id, { onDelete: "cascade" }),
  role: text("role", { enum: ["user", "assistant", "system"] }).notNull(),
  content: text("content").notNull(),
  timestamp: text("timestamp").notNull(),
});

// Settings table (key-value store)
export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updated_at: text("updated_at").notNull(),
});
