import { injectable, inject } from "tsyringe";
import { plainToClass, plainToInstance } from 'class-transformer';
import { IEpicRepo } from "../../domain/IRepos/IEpicRepo";
import { CreateEpicDto, UpdateEpicDto, EpicResponseDto } from "../../domain/DTOs/epicDTO";
import { Epic } from "../../domain/entities/epic.entity";
import { ApiError } from "../../API/middlewares/error.middleware";

@injectable()
export class EpicService {
  constructor(
    @inject("IEpicRepo") private readonly epicRepo: IEpicRepo
  ) {}
  async create(createEpicDto: CreateEpicDto): Promise<EpicResponseDto> {
    let existingEpic: Epic | null = null;

    if (createEpicDto.boardProjectId) {      // Case 1: boardProjectId is provided. Check uniqueness for key within this board.
      existingEpic = await this.epicRepo.findByKeyAndBoardProjectId(createEpicDto.key, createEpicDto.boardProjectId);
      if (existingEpic) {
        throw new ApiError(409, `Epic with key "${createEpicDto.key}" already exists in board "${createEpicDto.boardProjectId}".`);
      }
    } else {
      // Case 2: boardProjectId is NOT provided (it's null or undefined).
      // Check if an epic with this key already exists without a board project.
      existingEpic = await this.epicRepo.findByKeyAndBoardProjectId(createEpicDto.key, null);
      if (existingEpic) {
        throw new ApiError(409, `Epic with key "${createEpicDto.key}" already exists without an assigned board project.`);
      }
    }

    const newEpicEntity = await this.epicRepo.create(createEpicDto);
    return plainToInstance(EpicResponseDto, newEpicEntity, { excludeExtraneousValues: true });
  }

  async getAll(): Promise<EpicResponseDto[]> {
    const epics = await this.epicRepo.findAll();
    return plainToInstance(EpicResponseDto, epics, { excludeExtraneousValues: true });
  }

  async getById(id: string): Promise<EpicResponseDto | null> {
    const epic = await this.epicRepo.findById(id);
    if (!epic) {
      return null;
    }
    return plainToInstance(EpicResponseDto, epic, { excludeExtraneousValues: true });
  }  async getByKeyAndBoard(key: string, boardProjectId: string | null): Promise<EpicResponseDto | null> {
    // boardProjectId can be null to represent epics not associated with a board
    if (key.trim() === '') {
      throw new ApiError(400, "Epic key cannot be empty");
    }
    
    // No need for type assertion since our interface should handle null
    const epic = await this.epicRepo.findByKeyAndBoardProjectId(key, boardProjectId);
    if (!epic) {
      return null;
    }
    return plainToInstance(EpicResponseDto, epic, { excludeExtraneousValues: true });
  }
  async getByBoard(boardProjectId: string): Promise<EpicResponseDto[]> {
    if (!boardProjectId) {
        throw new ApiError(400, "boardProjectId is required to find epics by board.");
    }
    const epics = await this.epicRepo.findByBoardProjectId(boardProjectId);
    return plainToInstance(EpicResponseDto, epics, { excludeExtraneousValues: true });
  }
  async update(id: string, updateEpicDto: UpdateEpicDto): Promise<EpicResponseDto | null> {
    const existingEpicToUpdate = await this.epicRepo.findById(id);
    if (!existingEpicToUpdate) {
      throw new ApiError(404, `Epic with ID "${id}" not found.`);
    }

    const targetKey = updateEpicDto.key !== undefined ? updateEpicDto.key : existingEpicToUpdate.key;
    // If boardProjectId is explicitly set to null in DTO, use null.
    // If undefined in DTO, use existing. Otherwise, use DTO value.
    const targetBoardId = updateEpicDto.boardProjectId === null ? null : 
                         (updateEpicDto.boardProjectId === undefined ? existingEpicToUpdate.boardProjectId : updateEpicDto.boardProjectId);    // Check for conflict only if key or boardProjectId is potentially changing
    // to a combination that might conflict with *another* epic.
    if (targetKey !== existingEpicToUpdate.key || targetBoardId !== existingEpicToUpdate.boardProjectId) {
        // No need for type assertion since our interface accepts null
        const conflictingEpic = await this.epicRepo.findByKeyAndBoardProjectId(targetKey, targetBoardId);
        if (conflictingEpic && conflictingEpic.id !== id) {
          if (targetBoardId) {
            throw new ApiError(409, `Another epic with key "${targetKey}" already exists in board "${targetBoardId}".`);
          } else {
            throw new ApiError(409, `Another epic with key "${targetKey}" already exists without an assigned board project.`);
          }
        }
    }
      const updatedEpicEntity = await this.epicRepo.update(id, updateEpicDto);
    if (!updatedEpicEntity) {
        // This could happen if the ID doesn't exist (already checked) or if the update resulted in 0 affected rows
        // (e.g., data was identical, or a concurrent modification/deletion).
        throw new ApiError(404, `Epic with ID "${id}" could not be updated. It might have been deleted or the data was unchanged.`);
    }
    return plainToInstance(EpicResponseDto, updatedEpicEntity, { excludeExtraneousValues: true });
  }
  async delete(id: string): Promise<void> {
    const epic = await this.epicRepo.findById(id);
    if (!epic) {
      throw new ApiError(404, `Epic with ID "${id}" not found.`);
    }
    await this.epicRepo.delete(id);
  }
}