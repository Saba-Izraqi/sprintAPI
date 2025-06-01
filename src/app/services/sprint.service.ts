import { injectable, inject } from "tsyringe";
import { ISprintRepo } from "../../domain/IRepos/ISprintRepo";
import { CreateSprintDto, UpdateSprintDto, SprintResponseDto } from "../../domain/DTOs/sprintDTO";
import { plainToInstance } from "class-transformer";

@injectable()
export class SprintService {
  constructor(@inject("ISprintRepo") private sprintRepo: ISprintRepo) {}

  async getAll(projectId: string): Promise<SprintResponseDto[]> {
    const sprints = await this.sprintRepo.getAll(projectId);
    return sprints.map(s => plainToInstance(SprintResponseDto, s));
  }

  async getById(id: string): Promise<SprintResponseDto | null> {
    const sprint = await this.sprintRepo.getById(id);
    return sprint ? plainToInstance(SprintResponseDto, sprint) : null;
  }

  async create(dto: CreateSprintDto): Promise<SprintResponseDto> {
    const sprint = await this.sprintRepo.create({
      ...dto,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate)
    });
    return plainToInstance(SprintResponseDto, sprint);
  }

  async update(id: string, dto: UpdateSprintDto): Promise<SprintResponseDto | null> {

    const updateData: any = { ...dto };
    if (dto.startDate) updateData.startDate = new Date(dto.startDate);
    if (dto.endDate) updateData.endDate = new Date(dto.endDate);
    const sprint = await this.sprintRepo.update(id, updateData);
    return sprint ? plainToInstance(SprintResponseDto, sprint) : null;
  }

  async delete(id: string): Promise<boolean> {
    return this.sprintRepo.delete(id);
  }
}
