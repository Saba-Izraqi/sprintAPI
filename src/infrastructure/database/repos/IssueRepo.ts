import { In, Repository } from "typeorm";
import { Issue } from "../../../domain/entities/issue.entity";
import { IIssueRepo } from "../../../domain/IRepos/IIssueRepo";
import { AppDataSource } from "../data-source";
import { FindIssueQueryOptions } from "../../../domain/option/issueQueryOptions"; // Only import FindIssueQueryOptions

export class IssueRepo implements IIssueRepo {
  private repo: Repository<Issue>;

  constructor() {
    this.repo = AppDataSource.getRepository(Issue);
  }

  async create(issueData: Partial<Issue>): Promise<Issue> {
    // Always remove id to force new insert
    if ('id' in issueData) {
      delete issueData.id;
    }
    const issue = this.repo.create(issueData);
    return await this.repo.save(issue);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    return result.affected !== 0 && result.affected !== null;
  }

  // Consolidated get and find into a single find method
  async find(
    options?: FindIssueQueryOptions // Use the imported interface
  ): Promise<{ issues: Issue[]; total: number }> {
    const query = this.repo.createQueryBuilder("issue")
      .leftJoinAndSelect("issue.status", "status")
      .leftJoinAndSelect("issue.assigneeUser", "assigneeUser")
      .leftJoinAndSelect("issue.sprint", "sprint")
      .leftJoinAndSelect("issue.epic", "epic");

    if (options?.projectId) {
      query.where("issue.projectId = :projectId", { projectId: options.projectId });
    }
    if (options?.sprintId) {
      // Ensure 'where' or 'andWhere' is used appropriately based on whether projectId was present
      const conditionMethod = options?.projectId ? 'andWhere' : 'where';
      query[conditionMethod]("issue.sprintId = :sprintId", { sprintId: options.sprintId });
    }
    if (options?.assignee) {
      const conditionMethod = (options?.projectId || options?.sprintId) ? 'andWhere' : 'where';
      query[conditionMethod]("issue.assignee = :assignee", { assignee: options.assignee }); // Changed from issue.assigneeId
    }
    if (options?.statusId) {
      const conditionMethod = (options?.projectId || options?.sprintId || options?.assignee) ? 'andWhere' : 'where';
      query[conditionMethod]("issue.statusId = :statusId", { statusId: options.statusId });
    }
    if (options?.epicId) {
      const conditionMethod = (options?.projectId || options?.sprintId || options?.assignee || options?.statusId) ? 'andWhere' : 'where';
      query[conditionMethod]("issue.epicId = :epicId", { epicId: options.epicId });
    }
    // Removed parentId filter as it's not defined in the entity
    // if (options?.parentId) {
    //   const conditionMethod = (options?.projectId || options?.sprintId || options?.assignee || options?.statusId || options?.epicId) ? 'andWhere' : 'where';
    //   query[conditionMethod]("issue.parentId = :parentId", { parentId: options.parentId });
    // }
    // Removed searchTerm filter as it's not an entity property
    // if (options?.searchTerm) {
    //   const conditionMethod = (options?.projectId || options?.sprintId || options?.assignee || options?.statusId || options?.epicId) ? 'andWhere' : 'where';
    //   query[conditionMethod]("(issue.title ILIKE :searchTerm OR issue.description ILIKE :searchTerm OR issue.key ILIKE :searchTerm)", { searchTerm: `%${options.searchTerm}%` });
    // }

    const total = await query.getCount();

    // Removed pagination as it's not based on entity properties
    // if (options?.page && options?.limit) {
    //   query.skip((options.page - 1) * options.limit).take(options.limit);
    // }
    
    query.select([
      "issue.id",
      "issue.key",
      "issue.title",
      "status.id",
      "status.name",
      "assigneeUser.id",
      "assigneeUser.fullName", // Changed from name
      "assigneeUser.image",    // Changed from avatar
      "sprint.id",
      "sprint.name",
      "epic.id",
      "epic.title", // Changed from name
      // "epic.color", // Removed as it does not exist on Epic entity
    ]);

    const issues = await query.getMany();
    return { issues, total };
  }

  // Renamed from findFullById to getById
  async getById(id: string): Promise<Issue | null> {
    return await this.repo.findOne({
      where: { id },
      relations: [
        "assigneeUser",
        "project",
        "status",
        "sprint",
        "epic",
        // Removed outgoingRelations and incomingRelations as per the change request
      ],
    });
  }

  // Renamed from findByKey to getByKey
  async getByKey(key: string): Promise<Issue | null> {
    return await this.repo.findOne({ where: { key } });
  }

  async update(id: string, updateData: Partial<Issue>): Promise<Issue | null> {
    await this.repo.update(id, updateData);
    return await this.getById(id); // Assuming getById fetches the full entity
  }

  async generateIssueKey(projectId: string): Promise<string> {
    // Find the project prefix (e.g., from project entity or a config)
    const project = await AppDataSource.getRepository("Project").findOne({ where: { id: projectId } });
    // Use project.keyPrefix if available, otherwise fallback to projectId substring
    const prefix = project?.keyPrefix || projectId.substring(0, 3).toUpperCase();
    
    const lastIssue = await this.repo.createQueryBuilder("issue")
        .where("issue.projectId = :projectId", { projectId })
        .orderBy("issue.createdAt", "DESC") // Assuming key generation is sequential
        .select("issue.key", "issue_key") // Explicitly alias to ensure consistent raw result
        .getRawOne();

    let nextNumber = 1;
    if (lastIssue && lastIssue.issue_key) { // Access aliased column
        const parts = lastIssue.issue_key.split('-'); // Use aliased column
        if (parts.length > 1) {
            const lastNumber = parseInt(parts[parts.length -1], 10);
            if (!isNaN(lastNumber)) {
                nextNumber = lastNumber + 1;
            }
        }
    }
    return `${prefix}-${nextNumber}`;
  }

  // async getIssueCount(projectId: string): Promise<number> {
  //   return this.ormRepo.count({ where: { project: { id: projectId } } });
  // }

  async findById(id: string): Promise<Issue | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async findByIds(ids: string[]): Promise<Issue[]> {
    return await this.repo.findBy({ id: In(ids) });
  }
}
