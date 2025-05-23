import { injectable } from "tsyringe";
import { Repository, IsNull } from 'typeorm';
import { Epic } from '../../../domain/entities/epic.entity';
import { IEpicRepo } from '../../../domain/IRepos/IEpicRepo'; // Assuming interface name remains IEpicRepository
import { CreateEpicDto, UpdateEpicDto } from '../../../domain/DTOs/epicDTO';
import { AppDataSource } from "../data-source";

@injectable()
export class EpicRepo implements IEpicRepo { // Implementing IEpicRepository
  private readonly _epicRepo: Repository<Epic>; // Renamed variable

  constructor() {
    this._epicRepo = AppDataSource.getRepository(Epic);
  }

  async create(epicData: CreateEpicDto): Promise<Epic> {
    const newEpic = this._epicRepo.create({
        ...epicData,
    });
    return this._epicRepo.save(newEpic);
  }

  async findAll(): Promise<Epic[]> {
    return this._epicRepo.find({ relations: ['assigneeUser', 'board'] });
  }

  async findById(id: string): Promise<Epic | null> {
    return this._epicRepo.findOne({ 
        where: { id },
        relations: ['assigneeUser', 'board'] 
    });
  }  async findByKeyAndBoardProjectId(key: string, boardProjectId: string | null): Promise<Epic | null> {
    // Use TypeORM's IsNull operator for null checks
    const where = boardProjectId === null
      ? { key, boardProjectId: IsNull() }
      : { key, boardProjectId };
      
    return this._epicRepo.findOne({
      where,
      relations: ['assigneeUser', 'board'],
    });
  }

  async findByBoardProjectId(boardProjectId: string): Promise<Epic[]> {
    return this._epicRepo.find({
      where: { boardProjectId },
      relations: ['assigneeUser', 'board'],
    });
  }

  async update(id: string, epicData: UpdateEpicDto): Promise<Epic | null> {
    const result = await this._epicRepo.update(id, epicData);
    if (result.affected === 0) {
      return null;
    }
    return this.findById(id); 
  }

  async delete(id: string): Promise<void> {
    const result = await this._epicRepo.delete(id);
    if (result.affected === 0) {
      throw new Error("Epic not found");
    }
  }
}