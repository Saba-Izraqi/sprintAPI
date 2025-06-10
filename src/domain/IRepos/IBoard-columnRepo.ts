import {
  CreateBoardColumnDto,
  UpdateBoardColumnDto,
} from "../DTOs/board-columnDTO";
import { BoardColumn } from "../entities";

export interface IBoardColumnRepo {
  create(dto: CreateBoardColumnDto): Promise<BoardColumn>;
  update(id: string, dto: UpdateBoardColumnDto): Promise<BoardColumn>;
  delete(id: string): Promise<void>;
  get(projectId: string): Promise<BoardColumn[]>;
  getAll(): Promise<BoardColumn[]>;
}
