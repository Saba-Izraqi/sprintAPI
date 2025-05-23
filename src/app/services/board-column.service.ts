import { injectable, inject } from "tsyringe";
import { plainToInstance } from 'class-transformer';
import { IBoardColumnRepo } from "../../domain/IRepos/IBoardColumnRepo";
import { CreateBoardColumnDto, UpdateBoardColumnDto, BoardColumnResponseDto } from "../../domain/DTOs/boardColumnDTO";
import { ApiError } from "../../API/middlewares/error.middleware";

@injectable()
export class BoardColumnService {
  constructor(
    @inject("IBoardColumnRepo") private readonly boardColumnRepo: IBoardColumnRepo
  ) {}

  async create(createBoardColumnDto: CreateBoardColumnDto): Promise<BoardColumnResponseDto> {
    const newBoardColumnEntity = await this.boardColumnRepo.create(createBoardColumnDto);
    return plainToInstance(BoardColumnResponseDto, newBoardColumnEntity, { excludeExtraneousValues: true });
  }

  async getAll(): Promise<BoardColumnResponseDto[]> {
    const boardColumns = await this.boardColumnRepo.findAll();
    return plainToInstance(BoardColumnResponseDto, boardColumns, { excludeExtraneousValues: true });
  }

  async getById(id: string): Promise<BoardColumnResponseDto | null> {
    const boardColumn = await this.boardColumnRepo.findById(id);
    if (!boardColumn) {
      return null;
    }
    return plainToInstance(BoardColumnResponseDto, boardColumn, { excludeExtraneousValues: true });
  }

  async update(id: string, updateBoardColumnDto: UpdateBoardColumnDto): Promise<BoardColumnResponseDto | null> {
    const existingBoardColumn = await this.boardColumnRepo.findById(id);
    if (!existingBoardColumn) {
      throw new ApiError(404, `Board column with ID "${id}" not found.`);
    }

    const updatedBoardColumnEntity = await this.boardColumnRepo.update(id, updateBoardColumnDto);
    if (!updatedBoardColumnEntity) {
      throw new ApiError(404, `Board column with ID "${id}" could not be updated. It might have been deleted or the data was unchanged.`);
    }
    
    return plainToInstance(BoardColumnResponseDto, updatedBoardColumnEntity, { excludeExtraneousValues: true });
  }

  async delete(id: string): Promise<void> {
    const boardColumn = await this.boardColumnRepo.findById(id);
    if (!boardColumn) {
      throw new ApiError(404, `Board column with ID "${id}" not found.`);
    }
    await this.boardColumnRepo.delete(id);
  }
}
