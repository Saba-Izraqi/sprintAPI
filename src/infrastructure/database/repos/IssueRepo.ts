import { injectable } from "tsyringe";
import { Repository, IsNull } from 'typeorm';
import { Issue } from '../../../domain/entities/issue.entity';
import { IIssueRepo } from '../../../domain/IRepos/IIssueRepo';
import { CreateIssueDto, UpdateIssueDto } from '../../../domain/DTOs/issueDTO';
import { AppDataSource } from "../data-source";

@injectable()
export class IssueRepo implements IIssueRepo {
  private readonly _issueRepo: Repository<Issue>;

  constructor() {
    this._issueRepo = AppDataSource.getRepository(Issue);
  }

  async create(issueData: Partial<Issue>): Promise<Issue> {
    const newIssue = this._issueRepo.create(issueData);
    return this._issueRepo.save(newIssue);
  }

  async findAll(): Promise<Issue[]> {
    return this._issueRepo.find({ 
      relations: ['assigneeUser', 'board', 'epic', 'sprint', 'status']
    });
  }

  async findById(id: string): Promise<Issue | null> {
    return this._issueRepo.findOne({ 
      where: { id },
      relations: ['assigneeUser', 'board', 'epic', 'sprint', 'status']
    });
  }

  async findByKeyAndBoardProjectId(key: string, boardProjectId: string | null): Promise<Issue | null> {
    // Use TypeORM's IsNull operator for null checks
    const where = boardProjectId === null
      ? { key, boardProjectId: IsNull() }
      : { key, boardProjectId };
      
    return this._issueRepo.findOne({
      where,
      relations: ['assigneeUser', 'board', 'epic', 'sprint', 'status']
    });
  }

  async findByBoardProjectId(boardProjectId: string): Promise<Issue[]> {
    return this._issueRepo.find({
      where: { boardProjectId },
      relations: ['assigneeUser', 'board', 'epic', 'sprint', 'status']
    });
  }

  async findByEpicId(epicId: string): Promise<Issue[]> {
    return this._issueRepo.find({
      where: { epicId },
      relations: ['assigneeUser', 'board', 'epic', 'sprint', 'status']
    });
  }

  async findBySprintId(sprintId: string): Promise<Issue[]> {
    return this._issueRepo.find({
      where: { sprintId },
      relations: ['assigneeUser', 'board', 'epic', 'sprint', 'status']
    });
  }

  async findByAssignee(userId: string): Promise<Issue[]> {
    return this._issueRepo.find({
      where: { assignee: userId },
      relations: ['assigneeUser', 'board', 'epic', 'sprint', 'status']
    });
  }

  async update(id: string, issueData: Partial<Issue>): Promise<Issue | null> {
    const result = await this._issueRepo.update(id, issueData);
    if (result.affected === 0) {
      return null;
    }
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    const result = await this._issueRepo.delete(id);
    if (result.affected === 0) {
      throw new Error("Issue not found");
    }
  }
}
