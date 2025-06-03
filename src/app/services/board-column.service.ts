import { inject, injectable } from "tsyringe";
import { IBoardColumnRepo } from "../../domain/IRepos/IBoard-columnRepo";
import { BoardColumn } from "../../domain/entities";
import {
  CreateBoardColumnDto,
  UpdateBoardColumnDto,
} from "../../domain/DTOs/board-columnDTO";
import { getDBError } from "../../infrastructure/database/utils/handleDBErrors";

@injectable()
export class BoardColumnService {
  constructor(
    @inject("IBoardColumnRepo") private boardColumnRepo: IBoardColumnRepo
  ) {}

  async create(dto: CreateBoardColumnDto): Promise<BoardColumn> {
    return await this.boardColumnRepo.create(dto);
  }

  async update(id: string, dto: UpdateBoardColumnDto): Promise<BoardColumn> {
    return await this.boardColumnRepo.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    return await this.boardColumnRepo.delete(id);
  }

  async get(projectId: string): Promise<BoardColumn[]> {
    try {
      let columns = await this.boardColumnRepo.get(projectId);

      if (!columns.length) {
        columns = await this.createDefaultColumns(projectId);
      }

      return columns;
    } catch (error) {
      throw getDBError(error);
    }
  }
  /**
   * Creates default columns (To Do, In Progress, Done)
   * when a project has no existing columns.
   */

async createDefaultColumns(
    projectId: string
  ): Promise<BoardColumn[]> {
    const defaults: CreateBoardColumnDto[] = [
      { name: "To Do", order: 0, projectId },
      { name: "In Progress", order: 1, projectId },
      { name: "Done", order: 2, projectId },
    ];

    const created: BoardColumn[] = [];

    for (const dto of defaults) {
      const col = await this.boardColumnRepo.create(dto);
      created.push(col);
    }

    return created;
  }
}
