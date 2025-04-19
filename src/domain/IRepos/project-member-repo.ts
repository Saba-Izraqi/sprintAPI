import { CreateProjectMemberDto, UpdateProjectMemberDto, ProjectMemberResponseDto } from "../Dto/project-member.dto";

export interface IProjectMemberRepository {
  addMember(member: CreateProjectMemberDto): Promise<ProjectMemberResponseDto>;
  findById(id: string): Promise<ProjectMemberResponseDto | null>;
  findByUserAndProject(userId: string, projectId: string): Promise<ProjectMemberResponseDto | null>;
  update(id: string, updates: UpdateProjectMemberDto): Promise<ProjectMemberResponseDto | null>;
  removeMember(id: string): Promise<boolean>;
  getProjectMembers(projectId: string): Promise<ProjectMemberResponseDto[]>;
  getUserProjects(userId: string): Promise<ProjectMemberResponseDto[]>;
}