import type { AgentRole } from "@lyar/types";

export interface Skill {
  id: string;
  name: string;
  description: string;
  version: string;
  author?: string;
  applicableRoles: AgentRole[];
  content: string;
  tags?: string[];
}

export interface SkillMetadata {
  id: string;
  name: string;
  description: string;
  version: string;
  author?: string;
  applicableRoles: AgentRole[];
  tags?: string[];
}
