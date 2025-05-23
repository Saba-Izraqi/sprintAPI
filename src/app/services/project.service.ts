import { injectable, inject } from "tsyringe";
import { plainToInstance } from 'class-transformer';
import { IProjectRepo } from "../../domain/IRepos/IProjectRepo";
import { IBoardRepo } from "../../domain/IRepos/IBoardRepo";
import { CreateProjectDto, UpdateProjectDto, ProjectResponseDto } from "../../domain/DTOs/projectDTO";
import { ApiError } from "../../API/middlewares/error.middleware";
import { User } from "../../domain/entities/user.entity";

@injectable()
export class ProjectService {
  constructor(
    @inject("IProjectRepo") private readonly projectRepo: IProjectRepo,
    @inject("IBoardRepo") private readonly boardRepo: IBoardRepo
  ) {}
  
  async create(createProjectDto: CreateProjectDto, userId: string): Promise<ProjectResponseDto> {
    try {      // Create the project with proper User relation, using the authenticated user's ID
      const newProject = await this.projectRepo.create({
        name: createProjectDto.name,
        keyPrefix: createProjectDto.keyPrefix,
        createdBy: { id: userId } as User // Map the authenticated user ID to a User entity reference
      });
        // Create a default board for the project
      await this.boardRepo.create({
        projectId: newProject.id,
        name: `${newProject.name} Board`
      });
        // Fetch the complete project with relations to ensure all data is loaded
      const completeProject = await this.projectRepo.findById(newProject.id);
      
      // Add userId as a temporary property to help with transformation
      const projectWithUserId = {
        ...completeProject,
        _userId: userId // Temporary property to help with transformation
      };
      
      return plainToInstance(ProjectResponseDto, projectWithUserId, { excludeExtraneousValues: true });
    } catch (error: any) {
      // Check if it's a unique constraint violation error
      if (error.code === '23505' || (error.message && error.message.includes('duplicate key'))) {
        throw new ApiError(409, `You already have a project with the key prefix "${createProjectDto.keyPrefix}".`);
      }
      throw error; // Re-throw any other errors
    }
  }

  async getAll(): Promise<ProjectResponseDto[]> {
    const projects = await this.projectRepo.findAll();
    return plainToInstance(ProjectResponseDto, projects, { excludeExtraneousValues: true });
  }

  async getById(id: string): Promise<ProjectResponseDto | null> {
    const project = await this.projectRepo.findById(id);
    if (!project) {
      return null;
    }
    return plainToInstance(ProjectResponseDto, project, { excludeExtraneousValues: true });
  }
  
  async getByCreator(userId: string): Promise<ProjectResponseDto[]> {
    const projects = await this.projectRepo.findByCreator(userId);
    return plainToInstance(ProjectResponseDto, projects, { excludeExtraneousValues: true });
  }
  async update(id: string, updateProjectDto: UpdateProjectDto): Promise<ProjectResponseDto | null> {
    try {
      const existingProject = await this.projectRepo.findById(id);
      if (!existingProject) {
        throw new ApiError(404, `Project with ID "${id}" not found.`);
      }
      
      const updatedProject = await this.projectRepo.update(id, updateProjectDto);
      if (!updatedProject) {
        throw new ApiError(404, `Project with ID "${id}" could not be updated. It might have been deleted.`);
      }
      
      // Fetch the complete project with relations to ensure all data is loaded
      const completeProject = await this.projectRepo.findById(id);
      return plainToInstance(ProjectResponseDto, completeProject, { excludeExtraneousValues: true });
    } catch (error: any) {
      // Check if it's a unique constraint violation error
      if (error.code === '23505' || (error.message && error.message.includes('duplicate key'))) {
        throw new ApiError(409, `You already have a project with the key prefix "${updateProjectDto.keyPrefix}".`);
      }
      throw error; // Re-throw any other errors
    }
  }

  async delete(id: string): Promise<void> {
    const project = await this.projectRepo.findById(id);
    if (!project) {
      throw new ApiError(404, `Project with ID "${id}" not found.`);
    }
    await this.projectRepo.delete(id);
  }
}
