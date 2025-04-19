import { CreateBoardColumnDto, UpdateBoardColumnDto, BoardColumnResponseDto } from "../Dto/board-column.dto";

export interface IBoardColumnRepository {
  create(column: CreateBoardColumnDto): Promise<BoardColumnResponseDto>;
  findById(id: string): Promise<BoardColumnResponseDto | null>;
  update(id: string, updates: UpdateBoardColumnDto): Promise<BoardColumnResponseDto | null>;
  delete(id: string): Promise<boolean>;
  getAll(): Promise<BoardColumnResponseDto[]>;
}