import { injectable } from "tsyringe";
import { AppDataSource } from "../data-source";
import { BoardColumn } from "../../../domain/entities";
import { IBoardColumnRepo } from "../../../domain/IRepos/IBoard-columnRepo";
import { UserError } from "../../../app/exceptions";
import { getDBError } from "../utils/handleDBErrors";
import {
  CreateBoardColumnDto,
  UpdateBoardColumnDto,
} from "../../../domain/DTOs/board-columnDTO";

@injectable()
export class BoardColumnRepo implements IBoardColumnRepo {
  private _boardColumnRepo;

  constructor() {
    this._boardColumnRepo = AppDataSource.getRepository(BoardColumn);
  }

  async create(dto: CreateBoardColumnDto): Promise<BoardColumn> {
    try {
      const column = this._boardColumnRepo.create(dto);
      return await this._boardColumnRepo.save(column);
    } catch (error) {
      throw getDBError(error);
    }
  }

  async update(id: string, dto: UpdateBoardColumnDto): Promise<BoardColumn> {
    try {
      const column = await this._boardColumnRepo.findOneBy({ id });
      if (!column) throw new UserError("BoardColumn not found");

      const updated = Object.assign(column, dto);
      return await this._boardColumnRepo.save(updated);
    } catch (error) {
      throw getDBError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const result = await this._boardColumnRepo.delete(id);
      if (!result.affected) throw new UserError("BoardColumn not found");
    } catch (error) {
      throw getDBError(error);
    }
  }

  async get(projectId: string): Promise<BoardColumn[]> {
    try {
      return await this._boardColumnRepo.find({
        where: { projectId },
        order: { order: "ASC" as const },
      });
    } catch (error) {
      throw getDBError(error);
    }
  }
}
