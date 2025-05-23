import { injectable, inject } from "tsyringe";
import { plainToInstance } from 'class-transformer';
import { IProjectMemberRepo } from "../../domain/IRepos/IProjectMemberRepo";
import { IProjectRepo } from "../../domain/IRepos/IProjectRepo";
import { CreateProjectMemberDto, UpdateProjectMemberDto, ProjectMemberResponseDto } from "../../domain/DTOs/projectMemberDTO";
import { ApiError } from "../../API/middlewares/error.middleware";

@injectable()
export class ProjectMemberService {
  constructor(
    @inject("IProjectMemberRepo") private readonly projectMemberRepo: IProjectMemberRepo,
    @inject("IProjectRepo") private readonly projectRepo: IProjectRepo
  ) {}

  async create(createMemberDto: CreateProjectMemberDto): Promise<ProjectMemberResponseDto> {
    // Check if project exists
    const project = await this.projectRepo.findById(createMemberDto.projectId);
    if (!project) {
      throw new ApiError(404, `Project with ID "${createMemberDto.projectId}" not found.`);
    }
    
    // Check if user is already a member of the project
    const existingMembership = await this.projectMemberRepo.findMembership(
      createMemberDto.userId, 
      createMemberDto.projectId
    );
    
    if (existingMembership) {
      throw new ApiError(409, `User with ID "${createMemberDto.userId}" is already a member of project with ID "${createMemberDto.projectId}".`);
    }

    const newMemberEntity = await this.projectMemberRepo.create(createMemberDto);
    return plainToInstance(ProjectMemberResponseDto, newMemberEntity, { excludeExtraneousValues: true });
  }

  async getAll(): Promise<ProjectMemberResponseDto[]> {
    const members = await this.projectMemberRepo.findAll();
    return plainToInstance(ProjectMemberResponseDto, members, { excludeExtraneousValues: true });
  }

  async getById(id: string): Promise<ProjectMemberResponseDto | null> {
    const member = await this.projectMemberRepo.findById(id);
    if (!member) {
      return null;
    }
    return plainToInstance(ProjectMemberResponseDto, member, { excludeExtraneousValues: true });
  }
  
  async getByProject(projectId: string): Promise<ProjectMemberResponseDto[]> {
    const members = await this.projectMemberRepo.findByProject(projectId);
    return plainToInstance(ProjectMemberResponseDto, members, { excludeExtraneousValues: true });
  }
  
  async getByUser(userId: string): Promise<ProjectMemberResponseDto[]> {
    const memberships = await this.projectMemberRepo.findByUser(userId);
    return plainToInstance(ProjectMemberResponseDto, memberships, { excludeExtraneousValues: true });
  }
  
  async getMembership(userId: string, projectId: string): Promise<ProjectMemberResponseDto | null> {
    const membership = await this.projectMemberRepo.findMembership(userId, projectId);
    if (!membership) {
      return null;
    }
    return plainToInstance(ProjectMemberResponseDto, membership, { excludeExtraneousValues: true });
  }

  async update(id: string, updateMemberDto: UpdateProjectMemberDto): Promise<ProjectMemberResponseDto | null> {
    const existingMember = await this.projectMemberRepo.findById(id);
    if (!existingMember) {
      throw new ApiError(404, `Project membership with ID "${id}" not found.`);
    }

    const updatedMemberEntity = await this.projectMemberRepo.update(id, updateMemberDto);
    if (!updatedMemberEntity) {
      throw new ApiError(404, `Project membership with ID "${id}" could not be updated. It might have been deleted.`);
    }
    
    return plainToInstance(ProjectMemberResponseDto, updatedMemberEntity, { excludeExtraneousValues: true });
  }

  async delete(id: string): Promise<void> {
    const member = await this.projectMemberRepo.findById(id);
    if (!member) {
      throw new ApiError(404, `Project membership with ID "${id}" not found.`);
    }
    await this.projectMemberRepo.delete(id);
  }
}
