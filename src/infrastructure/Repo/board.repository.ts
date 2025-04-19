import { Repository } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { Board } from "../../domain/entities/board.entity";
import { IBoardRepository } from "../../domain/IRepos/board.irepo";
import { CreateBoardDto, UpdateBoardDto, BoardResponseDto } from "../../domain/Dto/board.dto";

export class BoardRepository implements IBoardRepository {
  private repository: Repository<Board>;

  constructor() {
    this.repository = AppDataSource.getRepository(Board);
  }

  async create(board: CreateBoardDto): Promise<BoardResponseDto> {
    const newBoard = this.repository.create(board);
    await this.repository.save(newBoard);
    return this.toResponseDto(newBoard);
  }

  async findByProjectId(projectId: string): Promise<BoardResponseDto | null> {
    const board = await this.repository.findOneBy({ projectId });
    return board ? this.toResponseDto(board) : null;
  }

  async update(projectId: string, updates: UpdateBoardDto): Promise<BoardResponseDto | null> {
    await this.repository.update(projectId, updates);
    return this.findByProjectId(projectId);
  }

  async delete(projectId: string): Promise<boolean> {
    const result = await this.repository.delete(projectId);
    return result.affected !== 0;
  }

  private toResponseDto(board: Board): BoardResponseDto {
    return {
      projectId: board.projectId,
      name: board.name,
      createdAt: board.createdAt,
      updatedAt: board.updatedAt,
    };
  }
}