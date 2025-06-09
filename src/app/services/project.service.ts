import { injectable, inject } from "tsyringe";
import { IProjectRepo } from "../../domain/IRepos/IProjectRepo";
import {
  CreateProjectDto,
  UpdateProjectDTO,
} from "../../domain/DTOs/projectDTO";
import { Project } from "../../domain/entities";
import { FindProjectOptions } from "../../domain/types";

@injectable()
export class ProjectService {
  constructor(@inject("IProjectRepo") private projectRepo: IProjectRepo) {}

  async create(dto: CreateProjectDto): Promise<Project> {
    const project = this.projectRepo.create(dto);
    // TODO: add the creator as a member of the project with role ADMINISTRATOR
    // * Cannot address this [todo] until the projectMembers service is implemented

    // TODO: Should create the default status, columns and sprint for the project
    // * Cannot address this [todo] until the status, columns and sprint services are implemented
    return project;
  }

  async update(dto: UpdateProjectDTO): Promise<Project> {
    // TODO: When the user tries to update the keyPrefix, I should update all keys for epics and issues to use the new keyPrefix
    // * Cannot address this [todo] until the issue and epic services are implemented
    return this.projectRepo.update(dto);
  }

  async delete(id: string): Promise<void> {
    return this.projectRepo.delete(id);
  }  async find(options: FindProjectOptions, userId: string): Promise<Project[]> {
    console.log('🔍 ProjectService.find - Debug info:');
    console.log('- options:', options);
    console.log('- userId:', userId);
    
    const result = await this.projectRepo.find(options, userId);
    console.log('- projects returned from repo:', result?.length || 0);
    
    return result;
  }
}
