import { CreateProjectDto, ProjectResponseDto, UpdateProjectDTO } from "../DTOs/projectDTO";
import { Project } from "../entities";

export interface IProjectRepo {
  create(project: CreateProjectDto): Promise<Project>;
  update(project: UpdateProjectDTO): Promise<Project>;
  delete(id: string): Promise<void>;
  getByKeyPrefix(keyPrefix: string): Promise<Project | null>;
  getByName(key: string): Promise<Project[]>;
  getByUserId(userId: string): Promise<Project[]>;
}
