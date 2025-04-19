import { Repository } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { Sprint } from "../../domain/entities/sprint.entity";
import { ISprintRepository } from "../../domain/IRepos/sprint.repo";
import { CreateSprintDto, UpdateSprintDto, SprintResponseDto } from "../../domain/Dto/sprint.dto";

export class SprintRepository implements ISprintRepository {
  private repository: Repository<Sprint>;

  constructor() {
    this.repository = AppDataSource.getRepository(Sprint);
  }

  async create(sprint: CreateSprintDto): Promise<SprintResponseDto> {
    const newSprint = this.repository.create(sprint);
    await this.repository.save(newSprint);
    return this.toResponseDto(newSprint);
  }

  async findById(id: string): Promise<SprintResponseDto | null> {
    const sprint = await this.repository.findOneBy({ id });
    return sprint ? this.toResponseDto(sprint) : null;
  }

  async update(id: string, updates: UpdateSprintDto): Promise<SprintResponseDto | null> {
    await this.repository.update(id, updates);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }

  async getActiveSprint(projectId: string): Promise<SprintResponseDto | null> {
    const now = new Date();
    const sprint = await this.repository
      .createQueryBuilder("sprint")
      .where("sprint.boardProjectId = :projectId", { projectId })
      .andWhere("sprint.startDate <= :now", { now })
      .andWhere("sprint.endDate >= :now", { now })
      .getOne();
    return sprint ? this.toResponseDto(sprint) : null;
  }

  async getSprintsByProject(projectId: string): Promise<SprintResponseDto[]> {
    const sprints = await this.repository.findBy({ boardProjectId: projectId });
    return sprints.map(this.toResponseDto);
  }

  private toResponseDto(sprint: Sprint): SprintResponseDto {
    return {
      id: sprint.id,
      name: sprint.name,
      startDate: sprint.startDate,
      endDate: sprint.endDate,
      boardProjectId: sprint.boardProjectId,
      createdAt: sprint.createdAt,
      updatedAt: sprint.updatedAt,
    };
  }
}