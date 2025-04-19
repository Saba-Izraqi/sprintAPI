import { CreateEpicDto, UpdateEpicDto, EpicResponseDto } from "../Dto/epic.dto";

export interface IEpicRepository {
  create(epic: CreateEpicDto): Promise<EpicResponseDto>;
  findById(id: string): Promise<EpicResponseDto | null>;
  findByKey(key: string, projectId: string): Promise<EpicResponseDto | null>;
  update(id: string, updates: UpdateEpicDto): Promise<EpicResponseDto | null>;
  delete(id: string): Promise<boolean>;
  getEpicsByProject(projectId: string): Promise<EpicResponseDto[]>;
}