import type { AgentRole } from "@lyar/types";
import type { Skill, SkillMetadata } from "./types";

const skills = new Map<string, Skill>();

/**
 * Register a skill in the registry
 */
export function registerSkill(skill: Skill): void {
  skills.set(skill.id, skill);
}

/**
 * Get a skill by ID
 */
export function getSkill(id: string): Skill | undefined {
  return skills.get(id);
}

/**
 * Get all skills applicable to a role
 */
export function getSkillsForRole(role: AgentRole): Skill[] {
  return Array.from(skills.values()).filter((skill) =>
    skill.applicableRoles.includes(role)
  );
}

/**
 * List all registered skill metadata
 */
export function listSkills(): SkillMetadata[] {
  return Array.from(skills.values()).map(({ content, ...metadata }) => metadata);
}

/**
 * Clear all skills (useful for testing)
 */
export function clearSkills(): void {
  skills.clear();
}
