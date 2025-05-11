import { CreateStatusDto, UpdateStatusDto } from "../../domain/DTOs/statusDTO";
import { Status } from "../entities/status.entity";

export interface IStatusRepo {
  create(statusData: CreateStatusDto): Promise<Status>;
  findById(id: string): Promise<Status | null>;
  findAll(): Promise<Status[]>;
  findByColumn(columnId: string): Promise<Status[]>;
  update(id: string, updateData: UpdateStatusDto): Promise<Status>;
  delete(id: string): Promise<void>;
}