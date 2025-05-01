import { inject, injectable } from 'tsyringe';
import { IProjectRepository } from '../../domain/IRepos/IProjectRepo';
import { CreateProjectDto, UpdateProjectDto, ProjectResponseDto } from '../../domain/DTOs/projectDTO';

@injectable()
export class ProjectService {
    constructor(
        @inject('IProjectRepo') private readonly ProjectRepo: IProjectRepository
    ) {}

    async createProject(createProjectDto: CreateProjectDto): Promise<ProjectResponseDto> {
        // Check if project with same keyPrefix already exists
        const existingProject = await this.ProjectRepo.getAll();
        const keyPrefixExists = existingProject.some(
            project => project.keyPrefix.toLowerCase() === createProjectDto.keyPrefix.toLowerCase()
        );

        if (keyPrefixExists) {
            throw new Error('A project with this key prefix already exists');
        }

        return await this.ProjectRepo.create(createProjectDto);
    }

    async getProjectById(id: string): Promise<ProjectResponseDto> {
        const project = await this.ProjectRepo.findById(id);
        if (!project) {
            throw new Error('Project not found');
        }
        return project;
    }

    async updateProject(id: string, updateProjectDto: UpdateProjectDto): Promise<ProjectResponseDto> {
        // First check if project exists
        const existingProject = await this.ProjectRepo.findById(id);
        if (!existingProject) {
            throw new Error('Project not found');
        }

        // If keyPrefix is being updated, check for conflicts
        if (updateProjectDto.keyPrefix) {
            const allProjects = await this.ProjectRepo.getAll();
            const keyPrefixExists = allProjects.some(
                project => 
                    project.id !== id && 
                    project.keyPrefix.toLowerCase() === updateProjectDto.keyPrefix?.toLowerCase()
            );

            if (keyPrefixExists) {
                throw new Error('A project with this key prefix already exists');
            }
        }

        const updatedProject = await this.ProjectRepo.update(id, updateProjectDto);
        if (!updatedProject) {
            throw new Error('Failed to update project');
        }
        return updatedProject;
    }

    async deleteProject(id: string): Promise<boolean> {
        // First check if project exists
        const existingProject = await this.ProjectRepo.findById(id);
        if (!existingProject) {
            throw new Error('Project not found');
        }

        return await this.ProjectRepo.delete(id);
    }

    async getAllProjects(): Promise<ProjectResponseDto[]> {
        return await this.ProjectRepo.getAll();
    }

    async getProjectsByUser(userId: string): Promise<ProjectResponseDto[]> {
        return await this.ProjectRepo.getProjectsByUser(userId);
    }
}