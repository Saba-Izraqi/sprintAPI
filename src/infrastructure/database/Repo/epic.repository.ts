
import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Epic } from "../../../domain/entities/epic.entity";
import { IEpicRepository } from "../../../domain/IRepos/epic.irepo";
import { CreateEpicDto, UpdateEpicDto, EpicResponseDto } from "../../../domain/Dto/epic.dto";
import { injectable } from "tsyringe";

@injectable()
export class EpicRepository implements IEpicRepository {
  private repository: Repository<Epic>;

  constructor() {
    this.repository = AppDataSource.getRepository(Epic);
  }

  async create(epic: CreateEpicDto): Promise<EpicResponseDto> {
    const newEpic = this.repository.create(epic);
    await this.repository.save(newEpic);
    return this.toResponseDto(newEpic);
  }

  async findById(id: string): Promise<EpicResponseDto | null> {
    const epic = await this.repository.findOneBy({ id });
    return epic ? this.toResponseDto(epic) : null;
  }

  async findByKey(
    key: string,
    projectId: string
  ): Promise<EpicResponseDto | null> {
    const epic = await this.repository.findOneBy({
      key,
      boardProjectId: projectId,
    });
    return epic ? this.toResponseDto(epic) : null;
  }

  async update(
    id: string,
    updates: UpdateEpicDto
  ): Promise<EpicResponseDto | null> {
    const updateData: Partial<Epic> = {
      ...updates,
      assignee: updates.assignee ?? undefined, // Convert null to undefined explicitly
    };

    await this.repository.update(id, updateData);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }

  async getEpicsByProject(projectId: string): Promise<EpicResponseDto[]> {
    const epics = await this.repository.findBy({ boardProjectId: projectId });
    return epics.map(this.toResponseDto);
  }

  private toResponseDto(epic: Epic): EpicResponseDto {
    return {
      id: epic.id,
      key: epic.key,
      title: epic.title,
      description: epic.description,
      assignee: epic.assignee ?? undefined, // Convert null to undefined
      boardProjectId: epic.boardProjectId,
      createdAt: epic.createdAt,
      updatedAt: epic.updatedAt,
    };
  }
}





