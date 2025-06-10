import { Sprint } from "../entities";

export interface ISprintRepo {
  create(sprint: Partial<Sprint>): Promise<Sprint>;
  findById(id: string): Promise<Sprint | null>;
  findByProjectId(projectId: string): Promise<Sprint[]>;
  findAll(): Promise<Sprint[]>;
  findActiveByProjectId(projectId: string): Promise<Sprint | null>;
  update(id: string, updates: Partial<Sprint>): Promise<Sprint | null>;
  delete(id: string): Promise<boolean>;
  setActiveSprint(projectId: string, sprintId: string): Promise<void>;
  deactivateAllSprints(projectId: string): Promise<void>;
  findSprintWithIssues(id: string): Promise<Sprint | null>;
}
