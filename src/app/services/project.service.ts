import { injectable, inject } from "tsyringe";
import {
  FindProjectOptions,
  IProjectRepo,
} from "../../domain/IRepos/IProjectRepo";
import {
  CreateProjectDto,
  UpdateProjectDTO,
} from "../../domain/DTOs/projectDTO";
import { Project } from "../../domain/entities";

@injectable()
export class ProjectService {
  constructor(@inject("IProjectRepo") private projectRepo: IProjectRepo) {}

  async create(dto: CreateProjectDto): Promise<Project> {
    return this.projectRepo.create(dto);
  }

  async update(dto: UpdateProjectDTO): Promise<Project> {
    return this.projectRepo.update(dto);
  }

  async delete(id: string): Promise<void> {
    return this.projectRepo.delete(id);
  }
  async find(options: FindProjectOptions): Promise<Project[]> {
    return this.projectRepo.find(options);
  }
}
