import { injectable } from "tsyringe";
import { Repository } from 'typeorm';
import { Status, StatusType } from '../../../domain/entities/status.entity';
import { IStatusRepo } from '../../../domain/IRepos/IStatusRepo';
import { AppDataSource } from "../data-source";

@injectable()
export class StatusRepo implements IStatusRepo {
  private readonly _statusRepo: Repository<Status>;

  constructor() {
    this._statusRepo = AppDataSource.getRepository(Status);
  }

  async create(statusData: Partial<Status>): Promise<Status> {
    const newStatus = this._statusRepo.create(statusData);
    return this._statusRepo.save(newStatus);
  }

  async findAll(): Promise<Status[]> {
    return this._statusRepo.find({ 
      relations: ['column']
    });
  }

  async findById(id: string): Promise<Status | null> {
    return this._statusRepo.findOne({ 
      where: { id },
      relations: ['column'] 
    });
  }
  
  async findByType(type: StatusType): Promise<Status[]> {
    return this._statusRepo.find({
      where: { type },
      relations: ['column']
    });
  }
  
  async findByColumn(columnId: string): Promise<Status[]> {
    return this._statusRepo.find({
      where: { column: { id: columnId } },
      relations: ['column']
    });
  }

  async update(id: string, statusData: Partial<Status>): Promise<Status | null> {
    const result = await this._statusRepo.update(id, statusData);
    if (result.affected === 0) {
      return null;
    }
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    const result = await this._statusRepo.delete(id);
    if (result.affected === 0) {
      throw new Error("Status not found");
    }
  }
}
