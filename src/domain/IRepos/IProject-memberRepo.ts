import { CreateProjectMemberDto, UpdateProjectMemberDto } from "../DTOs/project-memderDTO";
import { ProjectMember } from "../entities";

export interface IProjectMemberRepo {
  add(dto: CreateProjectMemberDto): Promise<ProjectMember>;
  updatePermission(memberId: string, dto: UpdateProjectMemberDto): Promise<ProjectMember>;
  remove(memberId: string): Promise<void>;
  findByProject(projectId: string): Promise<ProjectMember[]>;
}