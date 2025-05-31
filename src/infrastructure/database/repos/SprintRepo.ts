import { injectable } from "tsyringe";
import { AppDataSource } from "../data-source";
import { Sprint } from "../../../domain/entities/sprint.entity";
import { ISprintRepo } from "../../../domain/IRepos/ISprintRepo";

@injectable()
export class SprintRepo implements ISprintRepo {
  private repo = AppDataSource.getRepository(Sprint);

  async getAll(projectId: string) {
    return this.repo.find({ where: { projectId } });
  }

  async getById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async create(data: Partial<Sprint>) {
    const sprint = this.repo.create(data);
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
