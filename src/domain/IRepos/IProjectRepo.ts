import { CreateProjectDto, UpdateProjectDTO } from "../DTOs/projectDTO";
import { Project } from "../entities";

export interface FindProjectOptions {
  userId: string;
  id?: string;
  name?: string;
  keyPrefix?: string;
  createdById?: string;
}

export interface IProjectRepo {
  create(dto: CreateProjectDto): Promise<Project>;
  update(dto: UpdateProjectDTO): Promise<Project>;
  delete(id: string): Promise<void>;
  find(options: FindProjectOptions): Promise<Project[]>;
}
