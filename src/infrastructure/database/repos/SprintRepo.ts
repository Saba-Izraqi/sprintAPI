import { injectable } from "tsyringe";
import { AppDataSource } from "../data-source";
import { Sprint } from "../../../domain/entities/sprint.entity";
import { ISprintRepo } from "../../../domain/IRepos/ISprintRepo";

@injectable()
export class SprintRepo implements ISprintRepo {
  private repo = AppDataSource.getRepository(Sprint);

  async getAll(projectId: string) {
    return this.repo.find({
      where: { projectId },
      relations: ["issues"] // Include child issues in the response
    });
  }

  async getById(id: string) {
    return this.repo.findOne({
      where: { id },
      relations: ["issues"] // Include child issues in the response
    });
  }

  async create(data: Partial<Sprint>) {
    const { name, startDate, endDate, projectId, isActive, isComplete } = data;
    const sprint = this.repo.create({
      name,
      startDate,
      endDate,
      projectId,
      isActive: isActive ?? false,
      isComplete: isComplete ?? false
    });
    return this.repo.save(sprint);
  }

  async update(id: string, data: Partial<Sprint>) {
    await this.repo.update(id, data);
    return this.getById(id);
  }

  async delete(id: string) {
    const result = await this.repo.delete(id);
    return !!result.affected;
  }
}
