import { Sprint } from "../entities/sprint.entity";

export interface ISprintRepo {
  getAll(projectId: string): Promise<Sprint[]>;
  getById(id: string): Promise<Sprint | null>;
  create(data: Partial<Sprint>): Promise<Sprint>;
  update(id: string, data: Partial<Sprint>): Promise<Sprint | null>;
  delete(id: string): Promise<boolean>;
}
