import { CreateProjectDto, ProjectResponseDto, UpdateProjectDTO } from "../DTOs/projectDTO";
import { Project } from "../entities";

export interface IProjectRepo {
  create(project: CreateProjectDto): Promise<Project>;
  update(project: UpdateProjectDTO): Promise<Project>;
  delete(id: string): Promise<void>;
  find(options: Partial<Project>): Promise<Project[]>; // TODO: Remove Partial ASAP
}
