import { injectable } from "tsyringe";
import { Repository } from 'typeorm';
import { BoardColumn } from '../../../domain/entities/board-column.entity';
import { IBoardColumnRepo } from '../../../domain/IRepos/IBoardColumnRepo';
import { AppDataSource } from "../data-source";

@injectable()
export class BoardColumnRepo implements IBoardColumnRepo {
  private readonly _boardColumnRepo: Repository<BoardColumn>;

  constructor() {
    this._boardColumnRepo = AppDataSource.getRepository(BoardColumn);
  }

  async create(boardColumnData: Partial<BoardColumn>): Promise<BoardColumn> {
    const newBoardColumn = this._boardColumnRepo.create(boardColumnData);
    return this._boardColumnRepo.save(newBoardColumn);
  }

  async findAll(): Promise<BoardColumn[]> {
    return this._boardColumnRepo.find({ 
      relations: ['statuses'],
      order: { order: 'ASC' } 
    });
  }

  async findById(id: string): Promise<BoardColumn | null> {
    return this._boardColumnRepo.findOne({ 
      where: { id },
      relations: ['statuses'] 
    });
  }

  async update(id: string, boardColumnData: Partial<BoardColumn>): Promise<BoardColumn | null> {
    const result = await this._boardColumnRepo.update(id, boardColumnData);
    if (result.affected === 0) {
      return null;
    }
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    const result = await this._boardColumnRepo.delete(id);
    if (result.affected === 0) {
      throw new Error("Board column not found");
    }
  }
}
