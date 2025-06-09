import { Repository } from "typeorm";
import { injectable } from "tsyringe";
import { AppDataSource } from "../data-source";
import { Status, BoardColumn } from "../../../domain/entities";
import { IStatusRepo } from "../../../domain/IRepos/IStatusRepo";
import { CreateStatusDto, UpdateStatusDto } from "../../../domain/DTOs/statusDTO";
import { getDBError } from "../utils/handleDBErrors";
import { UserError } from "../../../app/exceptions";

@injectable()
export class StatusRepo implements IStatusRepo {
  private readonly statusRepository: Repository<Status>;
  private readonly boardColumnRepository: Repository<BoardColumn>;

  constructor() {
    this.statusRepository = AppDataSource.getRepository(Status);
    this.boardColumnRepository = AppDataSource.getRepository(BoardColumn);
  }

  async create(dto: CreateStatusDto): Promise<Status> {
    try {
      // Validate board column if provided
      if (dto.columnId) {
        const column = await this.boardColumnRepository.findOneBy({ id: dto.columnId });
        if (!column) {
          throw new UserError(["Board column not found"], 404);
        }
      }

      const status = this.statusRepository.create({
        name: dto.name,
        type: dto.type,
        column: dto.columnId ? { id: dto.columnId } as BoardColumn : undefined,
      });

      return await this.statusRepository.save(status);
    } catch (error) {
      throw getDBError(error);
    }
  }

  async findById(id: string): Promise<Status | null> {
    try {
      return await this.statusRepository.findOne({
        where: { id },
        relations: ["column"],
      });
    } catch (error) {
      throw getDBError(error);
    }
  }

  async findByColumnId(columnId: string): Promise<Status[]> {
    try {
      return await this.statusRepository.find({
        where: { column: { id: columnId } },
        relations: ["column"],
        order: { name: "ASC" },
      });
    } catch (error) {
      throw getDBError(error);
    }
  }

  async findAll(): Promise<Status[]> {
    try {
      return await this.statusRepository.find({
        relations: ["column"],
        order: { name: "ASC" },
      });
    } catch (error) {
      throw getDBError(error);
    }
  }

  async update(id: string, dto: UpdateStatusDto): Promise<Status> {
    try {
      const status = await this.statusRepository.findOneBy({ id });
      if (!status) {
        throw new UserError(["Status not found"], 404);
      }

      // Validate board column if provided
      if (dto.columnId) {
        const column = await this.boardColumnRepository.findOneBy({ id: dto.columnId });
        if (!column) {
          throw new UserError(["Board column not found"], 404);
        }
      }

      // Update fields
      if (dto.name !== undefined) status.name = dto.name;
      if (dto.type !== undefined) status.type = dto.type;
      if (dto.columnId !== undefined) {
        status.column = dto.columnId ? { id: dto.columnId } as BoardColumn : undefined;
      }

      return await this.statusRepository.save(status);
    } catch (error) {
      throw getDBError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const result = await this.statusRepository.delete(id);
      if (result.affected === 0) {
        throw new UserError(["Status not found"], 404);
      }
    } catch (error) {
      throw getDBError(error);
    }
  }
}
