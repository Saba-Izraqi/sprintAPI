import { injectable, inject } from "tsyringe";
import { plainToInstance } from 'class-transformer';
import { IStatusRepo } from "../../domain/IRepos/IStatusRepo";
import { IBoardColumnRepo } from "../../domain/IRepos/IBoardColumnRepo";
import { CreateStatusDto, UpdateStatusDto, StatusResponseDto } from "../../domain/DTOs/statusDTO";
import { StatusType } from "../../domain/entities/status.entity";
import { ApiError } from "../../API/middlewares/error.middleware";

@injectable()
export class StatusService {
  constructor(
    @inject("IStatusRepo") private readonly statusRepo: IStatusRepo,
    @inject("IBoardColumnRepo") private readonly boardColumnRepo: IBoardColumnRepo
  ) {}

  async create(createStatusDto: CreateStatusDto): Promise<StatusResponseDto> {
    // Check if column exists if columnId is provided
    if (createStatusDto.columnId) {
      const column = await this.boardColumnRepo.findById(createStatusDto.columnId);
      if (!column) {
        throw new ApiError(404, `Board column with ID "${createStatusDto.columnId}" not found.`);
      }
    }

    const newStatusEntity = await this.statusRepo.create(createStatusDto);
    return plainToInstance(StatusResponseDto, newStatusEntity, { excludeExtraneousValues: true });
  }

  async getAll(): Promise<StatusResponseDto[]> {
    const statuses = await this.statusRepo.findAll();
    return plainToInstance(StatusResponseDto, statuses, { excludeExtraneousValues: true });
  }

  async getById(id: string): Promise<StatusResponseDto | null> {
    const status = await this.statusRepo.findById(id);
    if (!status) {
      return null;
    }
    return plainToInstance(StatusResponseDto, status, { excludeExtraneousValues: true });
  }
  
  async getByType(type: StatusType): Promise<StatusResponseDto[]> {
    const statuses = await this.statusRepo.findByType(type);
    return plainToInstance(StatusResponseDto, statuses, { excludeExtraneousValues: true });
  }
  
  async getByColumn(columnId: string): Promise<StatusResponseDto[]> {
    const column = await this.boardColumnRepo.findById(columnId);
    if (!column) {
      throw new ApiError(404, `Board column with ID "${columnId}" not found.`);
    }
    
    const statuses = await this.statusRepo.findByColumn(columnId);
    return plainToInstance(StatusResponseDto, statuses, { excludeExtraneousValues: true });
  }

  async update(id: string, updateStatusDto: UpdateStatusDto): Promise<StatusResponseDto | null> {
    const existingStatus = await this.statusRepo.findById(id);
    if (!existingStatus) {
      throw new ApiError(404, `Status with ID "${id}" not found.`);
    }

    // Check if column exists if columnId is provided in update
    if (updateStatusDto.columnId) {
      const column = await this.boardColumnRepo.findById(updateStatusDto.columnId);
      if (!column) {
        throw new ApiError(404, `Board column with ID "${updateStatusDto.columnId}" not found.`);
      }
    }

    const updatedStatusEntity = await this.statusRepo.update(id, updateStatusDto);
    if (!updatedStatusEntity) {
      throw new ApiError(404, `Status with ID "${id}" could not be updated. It might have been deleted.`);
    }
    
    return plainToInstance(StatusResponseDto, updatedStatusEntity, { excludeExtraneousValues: true });
  }

  async delete(id: string): Promise<void> {
    const status = await this.statusRepo.findById(id);
    if (!status) {
      throw new ApiError(404, `Status with ID "${id}" not found.`);
    }
    await this.statusRepo.delete(id);
  }
}
