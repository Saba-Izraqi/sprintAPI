import { injectable, inject } from "tsyringe";
import { ISprintRepo } from "../../domain/IRepos/ISprintRepo";
import { CreateSprintDto, UpdateSprintDto, SprintResponseDto } from "../../domain/DTOs/sprintDTO";
import { plainToInstance } from "class-transformer";

@injectable()
export class SprintService {
  constructor(@inject("ISprintRepo") private sprintRepo: ISprintRepo) {}

  async getAll(projectId: string) {
    const sprints = await this.sprintRepo.getAll(projectId);
    return sprints.map(s => plainToInstance(SprintResponseDto, s));
  }

  async getById(id: string) {
    const sprint = await this.sprintRepo.getById(id);
    return sprint ? plainToInstance(SprintResponseDto, sprint) : null;
  }

  async create(dto: CreateSprintDto) {
    const sprint = await this.sprintRepo.create(dto);
    return plainToInstance(SprintResponseDto, sprint);
  }

  async update(id: string, dto: UpdateSprintDto) {
    const sprint = await this.sprintRepo.update(id, dto);
    return sprint ? plainToInstance(SprintResponseDto, sprint) : null;
  }

  async delete(id: string) {
    return this.sprintRepo.delete(id);
  }
}
