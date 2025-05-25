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
    const project = this.projectRepo.create(dto);
    // TODO: add the creator as a member of the project with role ADMINISTRATOR
    // * Cannot address this [todo] until the projectMembers service is implemented
    return project;
  }

  async update(dto: UpdateProjectDTO): Promise<Project> {
    // TODO: When the user tries to update the keyPrefix, I should update all keys for epics and issues to use the new keyPrefix
    // * Cannot address this [todo] until the issue and epic services are implemented
    return this.projectRepo.update(dto);
  }

  async delete(id: string): Promise<void> {
    return this.projectRepo.delete(id);
  }

  async find(options: FindProjectOptions): Promise<Project[]> {
    return this.projectRepo.find(options);
  }
}
