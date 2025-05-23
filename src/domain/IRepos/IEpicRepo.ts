import { Epic } from "../entities";

export interface IEpicRepo {
  findAll(projectId: string): Promise<Epic[]>;
  findById(id: string): Promise<Epic | null>;
  create(epic: Partial<Epic>): Promise<Epic>;
  update(id: string, epicData: Partial<Epic>): Promise<Epic>;
  delete(id: string): Promise<boolean>;
  findByKey(key: string, projectId: string): Promise<Epic | null>;
}
