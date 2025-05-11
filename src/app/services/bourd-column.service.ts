import { inject, injectable } from "tsyringe";
import { IBoardColumnRepo  } from "../../domain/IRepos/IBourd-columnRepo";
import { BoardColumnRepo } from "../../infrastructure/database/repos/Bourd-columnRepo"; // Adjust if your token/interface name is different
import { CreateBoardColumnDto, UpdateBoardColumnDto, BoardColumnResponseDto } from "../../domain/DTOs/board-columnDTOs";

@injectable()
export class BoardColumnService {
  constructor(
    @inject("IBoardColumnRepo") 
    private readonly boardColumnRepository: IBoardColumnRepo
  ) {}

  async createBoardColumn(dto: CreateBoardColumnDto): Promise<BoardColumnResponseDto> {
    const boardColumn = await this.boardColumnRepository.create(dto);
    return new BoardColumnResponseDto(boardColumn);
  }

  async getAllBoardColumns(): Promise<BoardColumnResponseDto[]> {
    const boardColumns = await this.boardColumnRepository.findAll();
    return boardColumns.map(column => new BoardColumnResponseDto(column));
  }

  async getBoardColumnById(id: string): Promise<BoardColumnResponseDto> {
    const boardColumn = await this.boardColumnRepository.findById(id);
    if (!boardColumn) {
      throw new Error(`BoardColumn with ID "${id}" not found.`);
    }
    return new BoardColumnResponseDto(boardColumn);
  }

  async updateBoardColumn(id: string, dto: UpdateBoardColumnDto): Promise<BoardColumnResponseDto> {
    const existingColumn = await this.boardColumnRepository.findById(id);
    if (!existingColumn) {
      throw new Error(`BoardColumn with ID "${id}" not found.`);
    }

    // You might want to add specific business logic here, e.g., if name is being changed, check for uniqueness
    const updatedBoardColumn = await this.boardColumnRepository.update(id, dto);
    if (!updatedBoardColumn) {
      // This case should ideally be caught by the previous check, but as a safeguard:
      throw new Error(`BoardColumn with ID "${id}" could not be updated or was not found after update attempt.`);
    }
    return new BoardColumnResponseDto(updatedBoardColumn);
  }

  async deleteBoardColumn(id: string): Promise<void> {
    const boardColumn = await this.boardColumnRepository.findById(id);
    if (!boardColumn) {
      throw new Error(`BoardColumn with ID "${id}" not found.`);
    }
    // Add any business logic before deletion, e.g., what happens to statuses in this column?
    // The current entity setup (onDelete: "SET NULL" for Status.column) handles this at DB level.
    await this.boardColumnRepository.delete(id);
  }

  // Optional: If you need to find by name, similar to your repository
  async getBoardColumnByName(name: string): Promise<BoardColumnResponseDto | null> {
    const boardColumn = await this.boardColumnRepository.findByName(name);
    if (!boardColumn) {
      return null; // Or throw an error if non-existence should be an error condition
    }
    return new BoardColumnResponseDto(boardColumn);
  }
}