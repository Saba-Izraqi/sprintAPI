import { CreateStatusDto, UpdateStatusDto } from "../DTOs/statusDTO";
import { Status } from "../entities";

export interface IStatusRepo {
  create(dto: CreateStatusDto): Promise<Status>;
  findById(id: string): Promise<Status | null>;
  findByColumnId(columnId: string): Promise<Status[]>;
  findAll(): Promise<Status[]>;
  update(id: string, dto: UpdateStatusDto): Promise<Status>;
  delete(id: string): Promise<void>;
}
