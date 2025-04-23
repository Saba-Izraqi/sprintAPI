import { CreateStatusDto, UpdateStatusDto, StatusResponseDto } from "../Dto/status.dto";

export interface IStatusRepository {
  create(status: CreateStatusDto): Promise<StatusResponseDto>;
  findById(id: string): Promise<StatusResponseDto | null>;
  update(id: string, updates: UpdateStatusDto): Promise<StatusResponseDto | null>;
  delete(id: string): Promise<void>;
  getStatusesByColumn(columnId: string): Promise<StatusResponseDto[]>;
  getDefaultStatuses(): Promise<StatusResponseDto[]>;
}