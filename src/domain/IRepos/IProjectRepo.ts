import { CreateProjectDto, UpdateProjectDto, ProjectResponseDto } from "../DTOs/projectDTO";

export interface IProjectRepository {
  create(projectDto: CreateProjectDto, userId: string): Promise<ProjectResponseDto>; // Modified signature
  findById(id: string): Promise<ProjectResponseDto | null>;
  update(id: string, updates: UpdateProjectDto): Promise<ProjectResponseDto | null>;
  delete(id: string): Promise<boolean>;
  getAll(): Promise<ProjectResponseDto[]>;
  getProjectsByUser(userId: string): Promise<ProjectResponseDto[]>;
  findByKeyPrefix(keyPrefix: string): Promise<ProjectResponseDto | null>;
}