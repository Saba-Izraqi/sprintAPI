import { CreateBoardDto, UpdateBoardDto, BoardResponseDto } from "../Dto/board.dto";

export interface IBoardRepository {
  create(board: CreateBoardDto): Promise<BoardResponseDto>;
  findByProjectId(projectId: string): Promise<BoardResponseDto | null>;
  update(projectId: string, updates: UpdateBoardDto): Promise<BoardResponseDto | null>;
  delete(projectId: string): Promise<boolean>;
}