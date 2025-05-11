import { BoardColumn } from '../entities/board-column.entity';
import { CreateBoardColumnDto } from '../DTOs/board-columnDTOs'; // Assuming board-columnDTOs.ts is in DTOs folder
import { UpdateBoardColumnDto } from '../DTOs/board-columnDTOs'; // Assuming board-columnDTOs.ts is in DTOs folder

export interface IBoardColumnRepo {
  create(createBoardColumnDto: CreateBoardColumnDto): Promise<BoardColumn>;
  findAll(): Promise<BoardColumn[]>;
  findById(id: string): Promise<BoardColumn | null>;
  findByName(name: string): Promise<BoardColumn | null>; 
  update(id: string, updateBoardColumnDto: UpdateBoardColumnDto): Promise<BoardColumn | null>;
  delete(id: string): Promise<void>;

}

