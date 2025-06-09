import { CreateProjectMemberDto, UpdateProjectMemberDto } from "../DTOs/projectMemberDTO";
import { ProjectMember } from "../entities";

export interface IProjectMemberRepo {
  add(dto: CreateProjectMemberDto): Promise<ProjectMember>;
  update(dto: UpdateProjectMemberDto): Promise<ProjectMember>;
  remove(memberId: string): Promise<void>;
  get(projectId: string): Promise<ProjectMember[]>;
}
