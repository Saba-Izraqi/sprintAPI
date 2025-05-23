import { injectable } from "tsyringe";
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Sprint } from '../../../domain/entities/sprint.entity';
import { ISprintRepo } from '../../../domain/IRepos/ISprintRepo';
import { AppDataSource } from "../data-source";

@injectable()
export class SprintRepo implements ISprintRepo {
  private readonly _sprintRepo: Repository<Sprint>;

  constructor() {
    this._sprintRepo = AppDataSource.getRepository(Sprint);
  }

  async create(sprintData: Partial<Sprint>): Promise<Sprint> {
    const newSprint = this._sprintRepo.create(sprintData);
    return this._sprintRepo.save(newSprint);
  }

  async findAll(): Promise<Sprint[]> {
    return this._sprintRepo.find({ 
      relations: ['board'],
      order: {
        startDate: 'DESC' // Most recent sprints first
      }
    });
  }

  async findById(id: string): Promise<Sprint | null> {
    return this._sprintRepo.findOne({ 
      where: { id },
      relations: ['board']
    });
  }

  async findByBoardProjectId(boardProjectId: string): Promise<Sprint[]> {
    return this._sprintRepo.find({
      where: { boardProjectId },
      relations: ['board'],
      order: {
        startDate: 'DESC' // Most recent sprints first
      }
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Sprint[]> {
    // Find sprints that overlap with the provided date range
    return this._sprintRepo.find({
      where: [
        // Sprints that start within the range
        { startDate: Between(startDate, endDate) },
        // Sprints that end within the range
        { endDate: Between(startDate, endDate) },
        // Sprints that span the entire range
        {
          startDate: LessThanOrEqual(startDate),
          endDate: MoreThanOrEqual(endDate)
        }
      ],
      relations: ['board'],
      order: {
        startDate: 'ASC'
      }
    });
  }

  async findActiveSprints(): Promise<Sprint[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to beginning of day
    
    return this._sprintRepo.find({
      where: {
        startDate: LessThanOrEqual(today),
        endDate: MoreThanOrEqual(today)
      },
      relations: ['board'],
      order: {
        endDate: 'ASC' // Sprints ending soonest first
      }
    });
  }

  async update(id: string, sprintData: Partial<Sprint>): Promise<Sprint | null> {
    const result = await this._sprintRepo.update(id, sprintData);
    if (result.affected === 0) {
      return null;
    }
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    const result = await this._sprintRepo.delete(id);
    if (result.affected === 0) {
      throw new Error("Sprint not found");
    }
  }
}
