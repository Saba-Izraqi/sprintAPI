import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { ProjectMember } from "../../../domain/entities/project-members.entity";
import { IProjectMemberRepository } from "../../../domain/IRepos/project-member-repo";
import { CreateProjectMemberDto, UpdateProjectMemberDto, ProjectMemberResponseDto } from "../../../domain/Dto/project-member.dto";
import { injectable } from "tsyringe";

@injectable()
export class ProjectMemberRepository implements IProjectMemberRepository {
  private repository: Repository<ProjectMember>;

  constructor() {
    this.repository = AppDataSource.getRepository(ProjectMember);
  }

  async addMember(member: CreateProjectMemberDto): Promise<ProjectMemberResponseDto> {
    const newMember = this.repository.create({
      permission: member.permission,
      user: { id: member.userId },
      project: { id: member.projectId }
    });
    await this.repository.save(newMember);
    
    // Reload with relations to get full data
    return this.findById(newMember.id) as Promise<ProjectMemberResponseDto>;
  }

  async findById(id: string): Promise<ProjectMemberResponseDto | null> {
    const member = await this.repository.findOne({ 
      where: { id },
      relations: ["user", "project"]
    });
    return member ? this.toResponseDto(member) : null;
  }

  async findByUserAndProject(userId: string, projectId: string): Promise<ProjectMemberResponseDto | null> {
    const member = await this.repository.findOne({
      where: {
        user: { id: userId },
        project: { id: projectId }
      },
      relations: ["user", "project"]
    });
    return member ? this.toResponseDto(member) : null;
  }

  async update(id: string, updates: UpdateProjectMemberDto): Promise<ProjectMemberResponseDto | null> {
    await this.repository.update(id, updates);
    return this.findById(id);
  }

  async removeMember(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }

  async getProjectMembers(projectId: string): Promise<ProjectMemberResponseDto[]> {
    const members = await this.repository.find({
      where: { project: { id: projectId } },
      relations: ["user", "project"]
    });
    return members.map(this.toResponseDto);
  }

  async getUserProjects(userId: string): Promise<ProjectMemberResponseDto[]> {
    const members = await this.repository.find({
      where: { user: { id: userId } },
      relations: ["project", "user"]
    });
    return members.map(this.toResponseDto);
  }

  private toResponseDto(member: ProjectMember): ProjectMemberResponseDto {
    return {
      id: member.id,
      userId: member.user.id,
      projectId: member.project.id,
      permission: member.permission,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
    };
  }
}