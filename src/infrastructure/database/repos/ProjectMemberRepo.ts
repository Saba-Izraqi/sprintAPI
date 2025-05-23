import { injectable } from "tsyringe";
import { Repository } from 'typeorm';
import { ProjectMember } from '../../../domain/entities/project-members.entity';
import { IProjectMemberRepo } from '../../../domain/IRepos/IProjectMemberRepo';
import { AppDataSource } from "../data-source";

@injectable()
export class ProjectMemberRepo implements IProjectMemberRepo {
  private readonly _projectMemberRepo: Repository<ProjectMember>;

  constructor() {
    this._projectMemberRepo = AppDataSource.getRepository(ProjectMember);
  }

  async create(memberData: Partial<ProjectMember>): Promise<ProjectMember> {
    const newMember = this._projectMemberRepo.create(memberData);
    return this._projectMemberRepo.save(newMember);
  }

  async findAll(): Promise<ProjectMember[]> {
    return this._projectMemberRepo.find({ 
      relations: ['user', 'project'] 
    });
  }

  async findById(id: string): Promise<ProjectMember | null> {
    return this._projectMemberRepo.findOne({ 
      where: { id },
      relations: ['user', 'project'] 
    });
  }
  
  async findByProject(projectId: string): Promise<ProjectMember[]> {
    return this._projectMemberRepo.find({
      where: { project: { id: projectId } },
      relations: ['user', 'project']
    });
  }
  
  async findByUser(userId: string): Promise<ProjectMember[]> {
    return this._projectMemberRepo.find({
      where: { user: { id: userId } },
      relations: ['user', 'project']
    });
  }
  
  async findMembership(userId: string, projectId: string): Promise<ProjectMember | null> {
    return this._projectMemberRepo.findOne({
      where: {
        user: { id: userId },
        project: { id: projectId }
      },
      relations: ['user', 'project']
    });
  }

  async update(id: string, memberData: Partial<ProjectMember>): Promise<ProjectMember | null> {
    const result = await this._projectMemberRepo.update(id, memberData);
    if (result.affected === 0) {
      return null;
    }
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    const result = await this._projectMemberRepo.delete(id);
    if (result.affected === 0) {
      throw new Error("Project member not found");
    }
  }
}
