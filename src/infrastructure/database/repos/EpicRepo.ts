import { injectable } from "tsyringe";
import { IEpicRepo } from "../../../domain/IRepos/IEpicRepo";
import { AppDataSource } from "../data-source";
import { Epic } from "../../../domain/entities";
import { getDBError } from "../utils/handleDBErrors";
import { UserError } from "../../../app/exceptions";

@injectable()
export class EpicRepo implements IEpicRepo {
  private _epicRepo;

  constructor() {
    this._epicRepo = AppDataSource.getRepository(Epic);
  }

  async findAll(boardProjectId: string): Promise<Epic[]> {
    try {
      return await this._epicRepo.find({
        where: { boardProjectId },
        relations: ["assigneeUser", "board"],
      });
    } catch (error) {
      throw getDBError(error);
    }
  }

  async findById(id: string): Promise<Epic | null> {
    try {
      const epic = await this._epicRepo.findOne({
        where: { id },
        relations: ["assigneeUser", "board"],
      });
      return epic;
    } catch (error) {
      throw getDBError(error);
    }
  }

  async create(epicData: Partial<Epic>): Promise<Epic> {
    try {
      const epic = this._epicRepo.create(epicData);
      return await this._epicRepo.save(epic);
    } catch (error) {
      throw getDBError(error);
    }
  }

  async update(id: string, epicData: Partial<Epic>): Promise<Epic> {
    try {
      const result = await this._epicRepo.update(id, epicData);
      if (!result.affected) {
        throw new UserError([`Epic with ID ${id} not found.`], 404);
      }
      
      const updatedEpic = await this._epicRepo.findOne({
        where: { id },
        relations: ["assigneeUser", "board"],
      });
      
      if (!updatedEpic) {
        throw new UserError([`Epic with ID ${id} not found after update.`], 404);
      }
      
      return updatedEpic;
    } catch (error) {
      throw getDBError(error);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this._epicRepo.softDelete(id);
      return !!result.affected;
    } catch (error) {
      throw getDBError(error);
    }
  }

  async findByKey(key: string, boardProjectId: string): Promise<Epic | null> {
    try {
      return await this._epicRepo.findOne({
        where: { key, boardProjectId },
        relations: ["assigneeUser", "board"],
      });
    } catch (error) {
      throw getDBError(error);
    }
  }
}
