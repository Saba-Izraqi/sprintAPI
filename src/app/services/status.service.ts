import { inject, injectable } from "tsyringe";
import { IStatusRepo } from "../../domain/IRepos/IStatusRepo";
import { 
  CreateStatusDto, 
  UpdateStatusDto, 
  StatusResponseDto 
} from "../../domain/DTOs/statusDTO";
import { Status } from "../../domain/entities/status.entity";
import { StatusType } from "../../domain/entities/status.entity";

@injectable()
export class StatusService {
  constructor(
    @inject("IStatusRepo") private readonly statusRepo: IStatusRepo
  ) {}

  async createStatus(dto: CreateStatusDto): Promise<StatusResponseDto> {
    const status = await this.statusRepo.create(dto);
    return new StatusResponseDto(status);
  }

  async getStatusById(id: string): Promise<StatusResponseDto> {
    const status = await this.statusRepo.findById(id);
    if (!status) {
      throw new Error("Status not found");
    }
    return new StatusResponseDto(status);
  }

  async getAllStatuses(): Promise<StatusResponseDto[]> {
    const statuses = await this.statusRepo.findAll();
    return statuses.map(status => new StatusResponseDto(status));
  }

  async getStatusesByColumn(columnId: string): Promise<StatusResponseDto[]> {
    const statuses = await this.statusRepo.findByColumn(columnId);
    return statuses.map(status => new StatusResponseDto(status));
  }

  async updateStatus(
    id: string, 
    updateData: UpdateStatusDto
  ): Promise<StatusResponseDto> {
    const existingStatus = await this.statusRepo.findById(id);
    if (!existingStatus) {
      throw new Error("Status not found");
    }

    if (updateData.type !== undefined && 
        existingStatus.type === StatusType.IN_PROGRESS && 
        updateData.type === StatusType.BACKLOG) {
      throw new Error("Cannot revert status from IN_PROGRESS to BACKLOG");
    }

    const updatedStatus = await this.statusRepo.update(id, updateData);
    return new StatusResponseDto(updatedStatus);
  }

  async deleteStatus(id: string): Promise<void> {
    const status = await this.statusRepo.findById(id);
    if (!status) {
      throw new Error("Status not found");
    }
    
 
    
    await this.statusRepo.delete(id);
  }

  async changeStatusType(
    id: string, 
    newType: StatusType
  ): Promise<StatusResponseDto> {
    const status = await this.statusRepo.findById(id);
    if (!status) {
      throw new Error("Status not found");
    }

    if (status.type === StatusType.DONE && newType !== StatusType.DONE) {
      throw new Error("Cannot change status from DONE to another type");
    }

    const updatedStatus = await this.statusRepo.update(id, { type: newType });
    return new StatusResponseDto(updatedStatus);
  }
}