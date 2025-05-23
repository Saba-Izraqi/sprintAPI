import { injectable, inject } from "tsyringe";
import { plainToInstance } from 'class-transformer';
import { ISprintRepo } from "../../domain/IRepos/ISprintRepo";
import { CreateSprintDto, UpdateSprintDto, SprintResponseDto } from "../../domain/DTOs/sprintDTO";
import { Sprint } from "../../domain/entities/sprint.entity";
import { ApiError } from "../../API/middlewares/error.middleware";

@injectable()
export class SprintService {
  constructor(
    @inject("ISprintRepo") private readonly sprintRepo: ISprintRepo
  ) {}

  async create(createSprintDto: CreateSprintDto): Promise<SprintResponseDto> {
    // Validate dates
    const startDate = new Date(createSprintDto.startDate);
    const endDate = new Date(createSprintDto.endDate);
    
    if (isNaN(startDate.getTime())) {
      throw new ApiError(400, "Invalid start date format");
    }
    
    if (isNaN(endDate.getTime())) {
      throw new ApiError(400, "Invalid end date format");
    }
    
    if (startDate > endDate) {
      throw new ApiError(400, "Start date cannot be after end date");
    }

    // Create the sprint
    const newSprintEntity = await this.sprintRepo.create({
      ...createSprintDto,
      startDate,
      endDate
    });
    
    return plainToInstance(SprintResponseDto, newSprintEntity, { excludeExtraneousValues: true });
  }

  async getAll(): Promise<SprintResponseDto[]> {
    const sprints = await this.sprintRepo.findAll();
    return plainToInstance(SprintResponseDto, sprints, { excludeExtraneousValues: true });
  }

  async getById(id: string): Promise<SprintResponseDto | null> {
    const sprint = await this.sprintRepo.findById(id);
    if (!sprint) {
      return null;
    }
    return plainToInstance(SprintResponseDto, sprint, { excludeExtraneousValues: true });
  }

  async getByBoardProjectId(boardProjectId: string): Promise<SprintResponseDto[]> {
    if (!boardProjectId) {
      throw new ApiError(400, "boardProjectId is required to find sprints by board.");
    }
    const sprints = await this.sprintRepo.findByBoardProjectId(boardProjectId);
    return plainToInstance(SprintResponseDto, sprints, { excludeExtraneousValues: true });
  }

  async getByDateRange(startDate: string, endDate: string): Promise<SprintResponseDto[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime())) {
      throw new ApiError(400, "Invalid start date format");
    }
    
    if (isNaN(end.getTime())) {
      throw new ApiError(400, "Invalid end date format");
    }
    
    if (start > end) {
      throw new ApiError(400, "Start date cannot be after end date");
    }
    
    const sprints = await this.sprintRepo.findByDateRange(start, end);
    return plainToInstance(SprintResponseDto, sprints, { excludeExtraneousValues: true });
  }

  async getActiveSprints(): Promise<SprintResponseDto[]> {
    const sprints = await this.sprintRepo.findActiveSprints();
    return plainToInstance(SprintResponseDto, sprints, { excludeExtraneousValues: true });
  }

  async update(id: string, updateSprintDto: UpdateSprintDto): Promise<SprintResponseDto | null> {
    const existingSprintToUpdate = await this.sprintRepo.findById(id);
    if (!existingSprintToUpdate) {
      throw new ApiError(404, `Sprint with ID "${id}" not found.`);
    }

    // Handle date updates and validation
    let startDate = existingSprintToUpdate.startDate;
    let endDate = existingSprintToUpdate.endDate;

    if (updateSprintDto.startDate) {
      startDate = new Date(updateSprintDto.startDate);
      if (isNaN(startDate.getTime())) {
        throw new ApiError(400, "Invalid start date format");
      }
    }

    if (updateSprintDto.endDate) {
      endDate = new Date(updateSprintDto.endDate);
      if (isNaN(endDate.getTime())) {
        throw new ApiError(400, "Invalid end date format");
      }
    }

    // Check that start date is before end date
    if (startDate > endDate) {
      throw new ApiError(400, "Start date cannot be after end date");
    }

    // Prepare update data
    const updateData: Partial<Sprint> = {
      ...updateSprintDto,
      startDate,
      endDate
    };
    
    // Remove string dates from update data as we've already converted them
    if (updateSprintDto.startDate) delete updateData.startDate;
    if (updateSprintDto.endDate) delete updateData.endDate;

    // Update with processed dates
    updateData.startDate = startDate;
    updateData.endDate = endDate;
    
    const updatedSprintEntity = await this.sprintRepo.update(id, updateData);
    if (!updatedSprintEntity) {
      throw new ApiError(404, `Sprint with ID "${id}" could not be updated. It might have been deleted or the data was unchanged.`);
    }
    
    return plainToInstance(SprintResponseDto, updatedSprintEntity, { excludeExtraneousValues: true });
  }

  async delete(id: string): Promise<void> {
    const sprint = await this.sprintRepo.findById(id);
    if (!sprint) {
      throw new ApiError(404, `Sprint with ID "${id}" not found.`);
    }
    await this.sprintRepo.delete(id);
  }
}
