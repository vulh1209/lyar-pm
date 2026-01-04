import { nanoid } from "nanoid";

// ID prefixes for different entity types
const ID_PREFIXES = {
  project: "proj",
  feature: "feat",
  task: "task",
  session: "sess",
  message: "msg",
} as const;

type EntityType = keyof typeof ID_PREFIXES;

/**
 * Generate a prefixed ID for an entity
 * @example generateId("project") => "proj_abc123xyz"
 */
export function generateId(type: EntityType): string {
  return `${ID_PREFIXES[type]}_${nanoid(12)}`;
}

/**
 * Generate a raw nanoid without prefix
 */
export function generateRawId(size = 12): string {
  return nanoid(size);
}
