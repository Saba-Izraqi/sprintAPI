import { injectable } from "tsyringe";
import { Repository } from 'typeorm';
import { Project } from '../../../domain/entities/project.entity';
import { IProjectRepo } from '../../../domain/IRepos/IProjectRepo';
import { AppDataSource } from "../data-source";

@injectable()
export class ProjectRepo implements IProjectRepo {
  private readonly _projectRepo: Repository<Project>;

  constructor() {
    this._projectRepo = AppDataSource.getRepository(Project);
  }
  async create(projectData: Partial<Project>): Promise<Project> {
    const newProject = this._projectRepo.create(projectData);
    await this._projectRepo.save(newProject);
    
    // Return the project with relations loaded
    return this._projectRepo.findOne({
      where: { id: newProject.id },
      relations: ['createdBy']
    }) as Promise<Project>;
  }

  async findAll(): Promise<Project[]> {
    return this._projectRepo.find({ 
      relations: ['board', 'createdBy', 'members'] 
    });
  }
  async findById(id: string): Promise<Project | null> {
    // Use createQueryBuilder for more control over relation loading
    return this._projectRepo
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.board', 'board')
      .leftJoinAndSelect('project.createdBy', 'user')
      .leftJoinAndSelect('project.members', 'members')
      .where('project.id = :id', { id })
      .getOne();
  }
  
  async findByCreator(userId: string): Promise<Project[]> {
    return this._projectRepo.find({
      where: { createdBy: { id: userId } },
      relations: ['board', 'createdBy', 'members']
    });
  }

  async update(id: string, projectData: Partial<Project>): Promise<Project | null> {
    const result = await this._projectRepo.update(id, projectData);
    if (result.affected === 0) {
      return null;
    }
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    const result = await this._projectRepo.delete(id);
    if (result.affected === 0) {
      throw new Error("Project not found");
    }
  }
}
