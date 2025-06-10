import { Repository } from "typeorm";
import { injectable } from "tsyringe";
import { AppDataSource } from "../data-source";
import { Sprint, Project } from "../../../domain/entities";
import { ISprintRepo } from "../../../domain/IRepos/ISprintRepo";

@injectable()
export class SprintRepo implements ISprintRepo {
  private readonly sprintRepository: Repository<Sprint>;
  private readonly projectRepository: Repository<Project>;

  constructor() {
    this.sprintRepository = AppDataSource.getRepository(Sprint);
    this.projectRepository = AppDataSource.getRepository(Project);
  }

  async create(sprintData: Partial<Sprint>): Promise<Sprint> {
    const sprint = this.sprintRepository.create(sprintData);
    return await this.sprintRepository.save(sprint);
  }

  async findById(id: string): Promise<Sprint | null> {
    return await this.sprintRepository.findOne({
      where: { id },
      relations: ["project"],
    });
  }
  async findByProjectId(projectId: string): Promise<Sprint[]> {
    return await this.sprintRepository.find({
      where: { projectId },
      relations: ["project"],
      order: { createdAt: "DESC" },
    });
  }

  async findAll(): Promise<Sprint[]> {
    return await this.sprintRepository.find({
      relations: ["project"],
      order: { createdAt: "DESC" },
    });
  }

  async findActiveByProjectId(projectId: string): Promise<Sprint | null> {
    return await this.sprintRepository.findOne({
      where: { projectId, isActive: true },
      relations: ["project", "issues"],
    });
  }

  async update(id: string, updates: Partial<Sprint>): Promise<Sprint | null> {
    await this.sprintRepository.update(id, updates);
    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.sprintRepository.delete(id);
    return result.affected! > 0;
  }  async setActiveSprint(projectId: string, sprintId: string): Promise<void> {
    // First deactivate all sprints in the project
    await this.deactivateAllSprints(projectId);
    
    // Activate the specified sprint
    await this.sprintRepository.update(sprintId, { isActive: true });
    
    // Update project's active sprint using raw query to handle the column properly
    await this.projectRepository.query(
      `UPDATE projects SET "activeSprintId" = $1 WHERE id = $2`,
      [sprintId, projectId]
    );
  }

  async deactivateAllSprints(projectId: string): Promise<void> {
    await this.sprintRepository.update(
      { projectId },
      { isActive: false }
    );
    
    // Clear project's active sprint using raw query
    await this.projectRepository.query(
      `UPDATE projects SET "activeSprintId" = NULL WHERE id = $1`,
      [projectId]
    );
  }

  async findSprintWithIssues(id: string): Promise<Sprint | null> {
    return await this.sprintRepository.findOne({
      where: { id },
      relations: ["project", "issues", "issues.assigneeUser", "issues.status"],
    });
  }
}
