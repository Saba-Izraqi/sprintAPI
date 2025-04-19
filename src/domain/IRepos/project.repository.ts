import { CreateProjectDto, UpdateProjectDto, ProjectResponseDto } from "../Dto/project.dto";

export interface IProjectRepository {
  create(project: CreateProjectDto): Promise<ProjectResponseDto>;
  findById(id: string): Promise<ProjectResponseDto | null>;
  update(id: string, updates: UpdateProjectDto): Promise<ProjectResponseDto | null>;
  delete(id: string): Promise<boolean>;
  getAll(): Promise<ProjectResponseDto[]>;
  getProjectsByUser(userId: string): Promise<ProjectResponseDto[]>;
}