import { Repository } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { BoardColumn } from "../../domain/entities/board-column.entity";
import { IBoardColumnRepository } from "../../domain/IRepos/board-column.irepo";
import { CreateBoardColumnDto, UpdateBoardColumnDto, BoardColumnResponseDto } from "../../domain/Dto/board-column.dto";

export class BoardColumnRepository implements IBoardColumnRepository {
  private repository: Repository<BoardColumn>;

  constructor() {
    this.repository = AppDataSource.getRepository(BoardColumn);
  }

  async create(column: CreateBoardColumnDto): Promise<BoardColumnResponseDto> {
    const newColumn = this.repository.create(column);
    await this.repository.save(newColumn);
    return this.toResponseDto(newColumn);
  }

  async findById(id: string): Promise<BoardColumnResponseDto | null> {
    const column = await this.repository.findOneBy({ id });
    return column ? this.toResponseDto(column) : null;
  }

  async update(id: string, updates: UpdateBoardColumnDto): Promise<BoardColumnResponseDto | null> {
    await this.repository.update(id, updates);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }

  async getAll(): Promise<BoardColumnResponseDto[]> {
    const columns = await this.repository.find();
    return columns.map(this.toResponseDto);
  }

  private toResponseDto(column: BoardColumn): BoardColumnResponseDto {
    return {
      id: column.id,
      name: column.name,
      order: column.order,
      createdAt: column.createdAt,
      updatedAt: column.updatedAt,
    };
  }
}