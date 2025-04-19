import { Repository } from "typeorm";
import { AppDataSource } from "../../infrastructure/database/data-source";
import { Project } from "../../domain/entities/project.entity";
import { User } from "../../domain/entities/user.entity";
import { IProjectRepository } from "../../domain/IRepos/project.repository";
import { CreateProjectDto, UpdateProjectDto, ProjectResponseDto } from "../../domain/Dto/project.dto";

export class ProjectRepository implements IProjectRepository {
  private repository: Repository<Project>;
  private userRepository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(Project);
    this.userRepository = AppDataSource.getRepository(User);
  }

  async create(project: CreateProjectDto): Promise<ProjectResponseDto> {
    // First get the user entity
    const user = await this.userRepository.findOneBy({ id: project.createdBy });
    if (!user) {
      throw new Error(`User with ID ${project.createdBy} not found`);
    }

    // Create the project with the user entity
    const newProject = this.repository.create({
      name: project.name,
      keyPrefix: project.keyPrefix,
      createdBy: user
    });

    await this.repository.save(newProject);
    return this.toResponseDto(newProject);
  }

  async findById(id: string): Promise<ProjectResponseDto | null> {
    const project = await this.repository.findOne({ 
      where: { id },
      relations: ["createdBy"] // Include the user relation
    });
    return project ? this.toResponseDto(project) : null;
  }

  async update(id: string, updates: UpdateProjectDto): Promise<ProjectResponseDto | null> {
    await this.repository.update(id, updates);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }

  async getAll(): Promise<ProjectResponseDto[]> {
    const projects = await this.repository.find({ relations: ["createdBy"] });
    return projects.map(this.toResponseDto);
  }

  async getProjectsByUser(userId: string): Promise<ProjectResponseDto[]> {
    const projects = await this.repository
      .createQueryBuilder("project")
      .innerJoin("project.members", "member")
      .leftJoinAndSelect("project.createdBy", "user") // Include createdBy user
      .where("member.userId = :userId", { userId })
      .getMany();
    return projects.map(this.toResponseDto);
  }

  private toResponseDto(project: Project): ProjectResponseDto {
    return {
      id: project.id,
      name: project.name,
      keyPrefix: project.keyPrefix,
      createdBy: project.createdBy.id, // Now safe to access
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
}
  }