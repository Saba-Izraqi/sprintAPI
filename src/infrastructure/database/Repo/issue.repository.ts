import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Issue } from "../../../domain/entities/issue.entity";
import { IIssueRepository } from "../../../domain/IRepos/issue.irepo";
import { CreateIssueDto, UpdateIssueDto, IssueResponseDto } from "../../../domain/Dto/issue.dto";
import { injectable } from "tsyringe";

@injectable()
export class IssueRepository implements IIssueRepository {
  private repository: Repository<Issue>;

  constructor() {
    this.repository = AppDataSource.getRepository(Issue);
  }

  async create(issue: CreateIssueDto): Promise<IssueResponseDto> {
    const newIssue = this.repository.create(issue);
    await this.repository.save(newIssue);
    return this.toResponseDto(newIssue);
  }

  async findById(id: string): Promise<IssueResponseDto | null> {
    const issue = await this.repository.findOneBy({ id });
    return issue ? this.toResponseDto(issue) : null;
  }

  async findByKey(key: string): Promise<IssueResponseDto | null> {
    const issue = await this.repository.findOneBy({ key });
    return issue ? this.toResponseDto(issue) : null;
  }

  async update(id: string, updates: UpdateIssueDto): Promise<IssueResponseDto | null> {
    await this.repository.update(id, updates as object);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }

  async getIssuesByProject(projectId: string): Promise<IssueResponseDto[]> {
    const issues = await this.repository.findBy({ boardProjectId: projectId });
    return issues.map(this.toResponseDto);
  }

  async getIssuesBySprint(sprintId: string): Promise<IssueResponseDto[]> {
    const issues = await this.repository.findBy({ sprintId });
    return issues.map(this.toResponseDto);
  }

  async getIssuesByEpic(epicId: string): Promise<IssueResponseDto[]> {
    const issues = await this.repository.findBy({ epicId });
    return issues.map(this.toResponseDto);
  }

  async getIssuesByAssignee(assigneeId: string): Promise<IssueResponseDto[]> {
    const issues = await this.repository.findBy({ assignee: assigneeId });
    return issues.map(this.toResponseDto);
  }

  private toResponseDto(issue: Issue): IssueResponseDto {
    return {
      id: issue.id,
      key: issue.key,
      title: issue.title,
      description: issue.description,
      storyPoint: issue.storyPoint,
      statusId: issue.statusId,
      assignee: issue.assignee,
      epicId: issue.epicId,
      sprintId: issue.sprintId,
      boardProjectId: issue.boardProjectId,
      createdAt: issue.createdAt,
      updatedAt: issue.updatedAt,
    };
  }
}