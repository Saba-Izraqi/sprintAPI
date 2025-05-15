import { inject, injectable } from 'tsyringe';
import { IProjectRepository } from '../../domain/IRepos/IProjectRepo';
import { CreateProjectDto, UpdateProjectDto, ProjectResponseDto } from '../../domain/DTOs/projectDTO';

@injectable()
export class ProjectService {
    constructor(
        @inject('IProjectRepo') private readonly ProjectRepo: IProjectRepository
    ) {}

    
    async create(createProjectDto: CreateProjectDto, userId: string): Promise<ProjectResponseDto> {
        const existingProject = await this.ProjectRepo.findByKeyPrefixAndUser(createProjectDto.keyPrefix, userId);

        if (existingProject) {
            throw new Error('You already have a project with this key prefix.');
        }

        return await this.ProjectRepo.create(createProjectDto, userId); 
    }


    async getProjectById(id: string): Promise<ProjectResponseDto> {
        const project = await this.ProjectRepo.findById(id);
        if (!project) {
            throw new Error('Project not found');
        }
        return project;
    }

    async updateProject(id: string, updateProjectDto: UpdateProjectDto): Promise<ProjectResponseDto> {
        const existingProject = await this.ProjectRepo.findById(id);
        if (!existingProject) {
            throw new Error('Project not found');
        }

       
        if (updateProjectDto.keyPrefix && updateProjectDto.keyPrefix.toLowerCase() !== existingProject.keyPrefix.toLowerCase()) {
            
            const projectWithSamePrefixForUser = await this.ProjectRepo.findByKeyPrefixAndUser(updateProjectDto.keyPrefix, existingProject.createdBy);
            if (projectWithSamePrefixForUser && projectWithSamePrefixForUser.id !== id) { 
                 throw new Error('You already have another project with this key prefix.');
            }
        }

        const updatedProject = await this.ProjectRepo.update(id, updateProjectDto);
        if (!updatedProject) {
            throw new Error('Failed to update project');
        }
        return updatedProject;
    }

    async deleteProject(id: string): Promise<boolean> {
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