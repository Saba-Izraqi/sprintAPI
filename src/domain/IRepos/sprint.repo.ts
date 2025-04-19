import { CreateSprintDto, UpdateSprintDto, SprintResponseDto } from "../Dto/sprint.dto";

export interface ISprintRepository {
  create(sprint: CreateSprintDto): Promise<SprintResponseDto>;
  findById(id: string): Promise<SprintResponseDto | null>;
  update(id: string, updates: UpdateSprintDto): Promise<SprintResponseDto | null>;
  delete(id: string): Promise<boolean>;
  getActiveSprint(projectId: string): Promise<SprintResponseDto | null>;
  getSprintsByProject(projectId: string): Promise<SprintResponseDto[]>;
}