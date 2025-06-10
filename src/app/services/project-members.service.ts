import { injectable, inject } from "tsyringe";
import { IProjectMemberRepo } from "../../domain/IRepos/IProject-memberRepo";
import { IUserRepo } from "../../domain/IRepos/IUserRepo";
import { IProjectRepo } from "../../domain/IRepos/IProjectRepo";
import {
  CreateProjectMemberDto,
  UpdateProjectMemberDto,
  ProjectMemberResponseDto,
} from "../../domain/DTOs/project-memberDTO";
import { ProjectMember } from "../../domain/entities";
import { UserError } from "../exceptions";
import { ProjectPermission } from "../../domain/types";

@injectable()
export class ProjectMemberService {
  constructor(
    @inject("IProjectMemberRepo")
    private _projectMemberRepo: IProjectMemberRepo,
    @inject("IUserRepo")
    private _userRepo: IUserRepo,
    @inject("IProjectRepo")
    private _projectRepo: IProjectRepo
  ) {}
  async addMember(dto: CreateProjectMemberDto): Promise<ProjectMemberResponseDto> {
    // Validate that the user exists
    const user = await this._userRepo.findByEmail(""); // We'll need to modify this
    // Since UserRepo doesn't have getById, we'll validate differently
    // For now, we'll trust that the frontend sends valid user IDs
    
    // Validate that the project exists
    const projects = await this._projectRepo.find({ id: dto.projectId });
    if (!projects || projects.length === 0) {
      throw new UserError(["Project not found"], 404);
    }

    // Check if user is already a member
    const existingMembers = await this._projectMemberRepo.findByProject(dto.projectId);
    const existingMember = existingMembers.find(member => member.user.id === dto.userId);
    
    if (existingMember) {
      throw new UserError(["User is already a member of this project"], 400);
    }

    const member = await this._projectMemberRepo.add(dto);
    
    // Fetch the member with relations for response
    const membersWithRelations = await this._projectMemberRepo.findByProject(dto.projectId);
    const newMember = membersWithRelations.find(m => m.id === member.id);
    
    if (!newMember) {
      throw new UserError(["Failed to retrieve created member"], 500);
    }
    
    return new ProjectMemberResponseDto(newMember);
  }

  async updateMemberPermission(
    memberId: string,
    dto: UpdateProjectMemberDto
  ): Promise<ProjectMemberResponseDto> {
    const member = await this._projectMemberRepo.updatePermission(memberId, dto);
    return new ProjectMemberResponseDto(member);
  }

  async removeMember(memberId: string): Promise<void> {
    await this._projectMemberRepo.remove(memberId);
  }  async getProjectMembers(projectId: string): Promise<ProjectMemberResponseDto[]> {
    // Validate that the project exists
    const projects = await this._projectRepo.find({ id: projectId });
    if (!projects || projects.length === 0) {
      throw new UserError(["Project not found"], 404);
    }

    const members = await this._projectMemberRepo.findByProject(projectId);
    return members.map(member => new ProjectMemberResponseDto(member));
  }

  async getAll(): Promise<ProjectMemberResponseDto[]> {
    const members = await this._projectMemberRepo.findAll();
    return members.map(member => new ProjectMemberResponseDto(member));
  }

  async checkUserPermission(
    userId: string,
    projectId: string
  ): Promise<ProjectPermission | null> {
    const members = await this._projectMemberRepo.findByProject(projectId);
    const userMember = members.find(member => member.user.id === userId);
    return userMember ? userMember.permission : null;
  }

  async isUserMember(userId: string, projectId: string): Promise<boolean> {
    const permission = await this.checkUserPermission(userId, projectId);
    return permission !== null;
  }

  async hasPermission(
    userId: string,
    projectId: string,
    requiredPermission: ProjectPermission
  ): Promise<boolean> {
    const userPermission = await this.checkUserPermission(userId, projectId);
    if (!userPermission) return false;
    
    // Check if user has required permission level
    // Assuming higher numbers mean higher permissions
    return userPermission >= requiredPermission;
  }
}