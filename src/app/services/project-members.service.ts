import { injectable, inject } from "tsyringe";
import { IProjectMemberRepo } from "../../domain/IRepos/IProject-memberRepo";
import {
  CreateProjectMemberDto,
  UpdateProjectMemberDto,
} from "../../domain/DTOs/project-memderDTO";
import { ProjectMember } from "../../domain/entities";

@injectable()
export class ProjectMemberService {
  constructor(
    @inject("IProjectMemberRepo")
    private projectMemberRepo: IProjectMemberRepo
  ) {}

  async addMember(dto: CreateProjectMemberDto): Promise<ProjectMember> {
    return this.projectMemberRepo.add(dto);
  }

  async updatePermission(
    memberId: string,
    dto: UpdateProjectMemberDto
  ): Promise<ProjectMember> {
    return this.projectMemberRepo.updatePermission(memberId, dto);
  }

  async removeMember(memberId: string): Promise<void> {
    return this.projectMemberRepo.remove(memberId);
  }

  async getProjectMembers(projectId: string): Promise<ProjectMember[]> {
    return this.projectMemberRepo.findByProject(projectId);
  }
}