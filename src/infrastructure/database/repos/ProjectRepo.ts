// src/infrastructure/repos/ProjectRepo.ts (Revised)
import { Repository, FindOneOptions } from "typeorm"; // Import FindOneOptions if needed for more complex queries
import { AppDataSource } from "../data-source";
import { Project } from "../../../domain/entities/project.entity";
import { User } from "../../../domain/entities/user.entity";
import { IProjectRepository } from "../../../domain/IRepos/IProjectRepo";
import { CreateProjectDto, UpdateProjectDto, ProjectResponseDto } from "../../../domain/DTOs/projectDTO";
import { injectable } from "tsyringe";

@injectable()
export class ProjectRepo implements IProjectRepository {
    private repository: Repository<Project>;
    private userRepository: Repository<User>;

    constructor() {
        this.repository = AppDataSource.getRepository(Project);
        this.userRepository = AppDataSource.getRepository(User);
    }

    async findByKeyPrefix(keyPrefix: string): Promise<ProjectResponseDto | null> {
        const project = await this.repository.findOneBy({ 
            keyPrefix: keyPrefix.toLowerCase() 
        });
        return project ? this.toResponseDto(project) : null;
    }

    async create(projectDto: CreateProjectDto, userId: string): Promise<ProjectResponseDto> { // Modified signature
        const user = await this.userRepository.findOneBy({ id: userId }); // Use userId parameter
        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }

        const newProject = this.repository.create({
            name: projectDto.name,
            keyPrefix: projectDto.keyPrefix,
            createdBy: user // Assign the fetched user entity
        });

        await this.repository.save(newProject);
        return this.toResponseDto(newProject);
    }

    async findById(id: string): Promise<ProjectResponseDto | null> {
        const project = await this.repository.findOne({
            where: { id },
            relations: ["createdBy"]
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
            .leftJoinAndSelect("project.createdBy", "user")
            .where("member.userId = :userId", { userId })
            .getMany();
        return projects.map(this.toResponseDto);
    }

    private toResponseDto(project: Project): ProjectResponseDto {
        return {
            id: project.id,
            name: project.name,
            keyPrefix: project.keyPrefix,
            createdBy: project.createdBy!.id, // Use the ID from the relation
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
        };
    }
}