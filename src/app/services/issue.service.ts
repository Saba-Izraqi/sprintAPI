import { injectable, inject } from "tsyringe";
import { plainToInstance } from 'class-transformer';
import { IIssueRepo } from "../../domain/IRepos/IIssueRepo";
import { IStatusRepo } from "../../domain/IRepos/IStatusRepo";
import { CreateIssueDto, UpdateIssueDto, IssueResponseDto } from "../../domain/DTOs/issueDTO";
import { Issue } from "../../domain/entities/issue.entity";
import { ApiError } from "../../API/middlewares/error.middleware";

@injectable()
export class IssueService {
  constructor(
    @inject("IIssueRepo") private readonly issueRepo: IIssueRepo,
    @inject("IStatusRepo") private readonly statusRepo: IStatusRepo
  ) {}

  async create(createIssueDto: CreateIssueDto): Promise<IssueResponseDto> {
    let existingIssue: Issue | null = null;

    // Check for uniqueness of issue key within board
    if (createIssueDto.boardProjectId) {
      existingIssue = await this.issueRepo.findByKeyAndBoardProjectId(
        createIssueDto.key, 
        createIssueDto.boardProjectId
      );
      
      if (existingIssue) {
        throw new ApiError(
          409, 
          `Issue with key "${createIssueDto.key}" already exists in board "${createIssueDto.boardProjectId}".`
        );
      }
    } else {
      existingIssue = await this.issueRepo.findByKeyAndBoardProjectId(createIssueDto.key, null);
      if (existingIssue) {
        throw new ApiError(
          409, 
          `Issue with key "${createIssueDto.key}" already exists without an assigned board project.`
        );
      }
    }

    const newIssueEntity = await this.issueRepo.create(createIssueDto);
    return plainToInstance(IssueResponseDto, newIssueEntity, { excludeExtraneousValues: true });
  }

  async getAll(): Promise<IssueResponseDto[]> {
    const issues = await this.issueRepo.findAll();
    return plainToInstance(IssueResponseDto, issues, { excludeExtraneousValues: true });
  }

  async getById(id: string): Promise<IssueResponseDto | null> {
    const issue = await this.issueRepo.findById(id);
    if (!issue) {
      return null;
    }
    return plainToInstance(IssueResponseDto, issue, { excludeExtraneousValues: true });
  }

  async getByKeyAndBoard(key: string, boardProjectId: string | null): Promise<IssueResponseDto | null> {
    if (key.trim() === '') {
      throw new ApiError(400, "Issue key cannot be empty");
    }
    
    const issue = await this.issueRepo.findByKeyAndBoardProjectId(key, boardProjectId);
    if (!issue) {
      return null;
    }
    return plainToInstance(IssueResponseDto, issue, { excludeExtraneousValues: true });
  }

  async getByBoard(boardProjectId: string): Promise<IssueResponseDto[]> {
    if (!boardProjectId) {
      throw new ApiError(400, "boardProjectId is required to find issues by board.");
    }
    const issues = await this.issueRepo.findByBoardProjectId(boardProjectId);
    return plainToInstance(IssueResponseDto, issues, { excludeExtraneousValues: true });
  }

  async getByEpic(epicId: string): Promise<IssueResponseDto[]> {
    if (!epicId) {
      throw new ApiError(400, "epicId is required to find issues by epic.");
    }
    const issues = await this.issueRepo.findByEpicId(epicId);
    return plainToInstance(IssueResponseDto, issues, { excludeExtraneousValues: true });
  }

  async getBySprint(sprintId: string): Promise<IssueResponseDto[]> {
    if (!sprintId) {
      throw new ApiError(400, "sprintId is required to find issues by sprint.");
    }
    const issues = await this.issueRepo.findBySprintId(sprintId);
    return plainToInstance(IssueResponseDto, issues, { excludeExtraneousValues: true });
  }

  async getByAssignee(userId: string): Promise<IssueResponseDto[]> {
    if (!userId) {
      throw new ApiError(400, "userId is required to find issues by assignee.");
    }
    const issues = await this.issueRepo.findByAssignee(userId);
    return plainToInstance(IssueResponseDto, issues, { excludeExtraneousValues: true });
  }

  async update(id: string, updateIssueDto: UpdateIssueDto): Promise<IssueResponseDto | null> {
    const existingIssueToUpdate = await this.issueRepo.findById(id);
    if (!existingIssueToUpdate) {
      throw new ApiError(404, `Issue with ID "${id}" not found.`);
    }

    const targetKey = updateIssueDto.key !== undefined ? updateIssueDto.key : existingIssueToUpdate.key;
    // If boardProjectId is explicitly set to null in DTO, use null.
    // If undefined in DTO, use existing. Otherwise, use DTO value.
    const targetBoardId = updateIssueDto.boardProjectId === null ? null : 
                         (updateIssueDto.boardProjectId === undefined ? existingIssueToUpdate.boardProjectId : updateIssueDto.boardProjectId);

    // Check for conflict only if key or boardProjectId is potentially changing
    // to a combination that might conflict with *another* issue.
    if (targetKey !== existingIssueToUpdate.key || targetBoardId !== existingIssueToUpdate.boardProjectId) {
        const conflictingIssue = await this.issueRepo.findByKeyAndBoardProjectId(targetKey, targetBoardId);
        if (conflictingIssue && conflictingIssue.id !== id) {
          if (targetBoardId) {
            throw new ApiError(409, `Another issue with key "${targetKey}" already exists in board "${targetBoardId}".`);
          } else {
            throw new ApiError(409, `Another issue with key "${targetKey}" already exists without an assigned board project.`);
          }
        }
    }
    
    const updatedIssueEntity = await this.issueRepo.update(id, updateIssueDto);
    if (!updatedIssueEntity) {
        throw new ApiError(404, `Issue with ID "${id}" could not be updated. It might have been deleted or the data was unchanged.`);
    }
    
    return plainToInstance(IssueResponseDto, updatedIssueEntity, { excludeExtraneousValues: true });
  }

  async delete(id: string): Promise<void> {
    const issue = await this.issueRepo.findById(id);
    if (!issue) {
      throw new ApiError(404, `Issue with ID "${id}" not found.`);
    }
    await this.issueRepo.delete(id);
  }
}
