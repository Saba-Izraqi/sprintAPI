import { injectable } from "tsyringe";
import { AppDataSource } from "../data-source";
import { BoardColumn } from "../../../domain/entities/board-column.entity";
import { IBoardColumnRepo } from "../../../domain/IRepos/IBourd-columnRepo"; 
import { CreateBoardColumnDto, UpdateBoardColumnDto } from "../../../domain/DTOs/board-columnDTOs"; 
import { Repository } from "typeorm";

@injectable()
export class BoardColumnRepo implements IBoardColumnRepo {
  private boardColumnRepository: Repository<BoardColumn>;

  constructor() {
    this.boardColumnRepository = AppDataSource.getRepository(BoardColumn);
  }

  async create(createDto: CreateBoardColumnDto): Promise<BoardColumn> {
    const column = this.boardColumnRepository.create({
      name: createDto.name,
      order: createDto.order,
    });
    return this.boardColumnRepository.save(column);
  }

  async findAll(): Promise<BoardColumn[]> {
    return this.boardColumnRepository.find({
      relations: ['statuses'], 
      order: { order: 'ASC' }, 
    });
  }

  async findById(id: string): Promise<BoardColumn | null> {
    return this.boardColumnRepository.findOne({
      where: { id },
      relations: ['statuses'], 
    });
  }

  async findByName(name: string): Promise<BoardColumn | null> {
    return this.boardColumnRepository.findOne({
      where: { name },
      relations: ['statuses'], 
    });
  }

  async update(id: string, updateDto: UpdateBoardColumnDto): Promise<BoardColumn | null> {
    const updatePayload: Partial<BoardColumn> = {};
    if (updateDto.name !== undefined) {
      updatePayload.name = updateDto.name;
    }
    if (updateDto.order !== undefined) {
      updatePayload.order = updateDto.order;
    }

    if (Object.keys(updatePayload).length === 0) {
        return this.findById(id);
    }

    const updateResult = await this.boardColumnRepository.update(id, updatePayload);

    if (updateResult.affected === 0) {
      return null; // Or throw a NotFoundException
    }

    // Fetch the updated entity with relations
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    const result = await this.boardColumnRepository.delete(id);
    if (result.affected === 0) {
      
    }
  }
}