import { inject, injectable } from "tsyringe";
import { IStatusRepo } from "../../domain/IRepos/IStatusRepo";
import { CreateStatusDto, UpdateStatusDto, StatusResponseDto } from "../../domain/DTOs/statusDTO";
import { UserError } from "../exceptions";

@injectable()
export class StatusService {
  constructor(
    @inject("IStatusRepo") private statusRepo: IStatusRepo
  ) {}

  async createStatus(dto: CreateStatusDto): Promise<StatusResponseDto> {
    const status = await this.statusRepo.create(dto);
    return new StatusResponseDto(status);
  }

  async getStatusById(id: string): Promise<StatusResponseDto> {
    const status = await this.statusRepo.findById(id);
    if (!status) {
      throw new UserError(["Status not found"], 404);
    }
    return new StatusResponseDto(status);
  }

  async getStatusesByColumn(columnId: string): Promise<StatusResponseDto[]> {
    const statuses = await this.statusRepo.findByColumnId(columnId);
    return statuses.map(status => new StatusResponseDto(status));
  }

  async getAllStatuses(): Promise<StatusResponseDto[]> {
    const statuses = await this.statusRepo.findAll();
    return statuses.map(status => new StatusResponseDto(status));
  }

  async updateStatus(id: string, dto: UpdateStatusDto): Promise<StatusResponseDto> {
    const status = await this.statusRepo.update(id, dto);
    return new StatusResponseDto(status);
  }

  async deleteStatus(id: string): Promise<void> {
    await this.statusRepo.delete(id);
  }
}
