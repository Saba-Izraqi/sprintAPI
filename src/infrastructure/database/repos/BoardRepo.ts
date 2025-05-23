import { injectable } from "tsyringe";
import { Repository } from 'typeorm';
import { Board } from '../../../domain/entities/board.entity';
import { IBoardRepo } from '../../../domain/IRepos/IBoardRepo';
import { AppDataSource } from "../data-source";

@injectable()
export class BoardRepo implements IBoardRepo {
  private readonly _boardRepo: Repository<Board>;

  constructor() {
    this._boardRepo = AppDataSource.getRepository(Board);
  }

  async create(boardData: Partial<Board>): Promise<Board> {
    const newBoard = this._boardRepo.create(boardData);
    return this._boardRepo.save(newBoard);
  }
  async findAll(): Promise<Board[]> {
    return this._boardRepo.find({ 
      relations: ['project', 'sprints'],
      order: {
        createdAt: 'DESC' // Get newest boards first
      }
    });
  }

  async findByProjectId(projectId: string): Promise<Board | null> {
    console.log(`Searching for board with projectId: ${projectId}`);
    
    // Now find the specific board with all necessary relations
    return this._boardRepo.findOne({ 
      where: { projectId },
      relations: ['project', 'sprints', 'sprints.issues'],
      relationLoadStrategy: 'query' // Use separate queries for better performance with deep relations
    });
  }

  async update(projectId: string, boardData: Partial<Board>): Promise<Board | null> {
    const result = await this._boardRepo.update(projectId, boardData);
    if (result.affected === 0) {
      return null;
    }
    return this.findByProjectId(projectId);
  }
  async delete(projectId: string): Promise<void> {
    console.log(`Attempting to delete board with projectId: ${projectId}`);
    
    // First verify the board exists
    const board = await this.findByProjectId(projectId);
    if (!board) {
      console.log(`No board found with projectId: ${projectId}`);
      throw new Error(`Board not found for project ID: ${projectId}`);
    }
    
    // Then delete it
    const result = await this._boardRepo.delete({ projectId });
    console.log(`Delete result: ${JSON.stringify(result)}`);
    
    if (result.affected === 0) {
      throw new Error(`Board deletion failed for projectId: ${projectId}`);
    }
  }
}
