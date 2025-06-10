import { injectable, inject } from "tsyringe";
import { IProjectRepo } from "../../domain/IRepos/IProjectRepo";
import {
  CreateProjectDto,
  UpdateProjectDTO,
} from "../../domain/DTOs/projectDTO";
import { Project } from "../../domain/entities";
import { FindProjectOptions, ProjectPermission } from "../../domain/types";
import { ProjectMembersService } from "./project-members.service";
import { CreateProjectMemberDto } from "../../domain/DTOs/projectMemberDTO";

@injectable()
export class ProjectService {
  constructor(
    @inject("IProjectRepo") private projectRepo: IProjectRepo,
    @inject("ProjectMembersService")
    private memberService: ProjectMembersService
  ) {}

  async create(dto: CreateProjectDto): Promise<Project> {
    const project = await this.projectRepo.create(dto);

    const newMembership: CreateProjectMemberDto = {
      userId: project.createdBy,
      projectId: project.id,
      permission: ProjectPermission.ADMINISTRATOR,
    };
    this.memberService.add(newMembership);

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
  }

  async find(options: FindProjectOptions, userId: string): Promise<Project[]> {
    return this.projectRepo.find(options, "");
  }
}
