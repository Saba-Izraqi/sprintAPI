import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { IssueService } from '../../app/services/issue.service';
import { CreateIssueDto, UpdateIssueDto } from '../../domain/DTOs/issueDTO';
import { validate } from 'class-validator';
import { ApiError } from '../middlewares/error.middleware';

@injectable()
export class IssueController {
  constructor(
    @inject(IssueService) private readonly issueService: IssueService
  ) {}

  // POST /issues
  async createIssue(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const createIssueDto = new CreateIssueDto();
      Object.assign(createIssueDto, req.body);

      const errors = await validate(createIssueDto);
      if (errors.length > 0) {
        next(new ApiError(400, 'Validation failed'));
        return;
      }

      const issue = await this.issueService.create(createIssueDto);
      res.status(201).json(issue);
    } catch (error) {
      next(error);
    }
  }

  // GET /issues
  async getAllIssues(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const issues = await this.issueService.getAll();
      res.status(200).json(issues);
    } catch (error) {
      next(error);
    }
  }

  // GET /issues/:id
  async getIssueById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const issue = await this.issueService.getById(id);
      if (!issue) {
        next(new ApiError(404, `Issue with ID "${id}" not found.`));
        return;
      }
      res.status(200).json(issue);
    } catch (error) {
      next(error);
    }
  }

  // GET /issues/board/:boardProjectId/key/:key
  async getIssueByKeyAndBoard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { key, boardProjectId } = req.params;
      // Handle the special case where boardProjectId is "null" as a string
      const boardId = boardProjectId === "null" ? null : boardProjectId;
      
      const issue = await this.issueService.getByKeyAndBoard(key, boardId);
      
      if (!issue) {
        const boardMessage = boardId ? `in board "${boardProjectId}"` : "without a board";
        next(new ApiError(404, `Issue with key "${key}" ${boardMessage} not found.`));
        return;
      }
      
      res.status(200).json(issue);
    } catch (error) {
      next(error);
    }
  }

  // GET /issues/board/:boardProjectId
  async getIssuesByBoard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { boardProjectId } = req.params;
      if (!boardProjectId) {
        next(new ApiError(400, "BoardProjectId parameter is required"));
        return;
      }
      const issues = await this.issueService.getByBoard(boardProjectId);
      res.status(200).json(issues);
    } catch (error) {
      next(error);
    }
  }

  // GET /issues/epic/:epicId
  async getIssuesByEpic(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { epicId } = req.params;
      if (!epicId) {
        next(new ApiError(400, "EpicId parameter is required"));
        return;
      }
      const issues = await this.issueService.getByEpic(epicId);
      res.status(200).json(issues);
    } catch (error) {
      next(error);
    }
  }

  // GET /issues/sprint/:sprintId
  async getIssuesBySprint(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sprintId } = req.params;
      if (!sprintId) {
        next(new ApiError(400, "SprintId parameter is required"));
        return;
      }
      const issues = await this.issueService.getBySprint(sprintId);
      res.status(200).json(issues);
    } catch (error) {
      next(error);
    }
  }

  // GET /issues/assignee/:userId
  async getIssuesByAssignee(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      if (!userId) {
        next(new ApiError(400, "UserId parameter is required"));
        return;
      }
      const issues = await this.issueService.getByAssignee(userId);
      res.status(200).json(issues);
    } catch (error) {
      next(error);
    }
  }

  // PUT /issues/:id
  async updateIssue(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updateIssueDto = new UpdateIssueDto();
      Object.assign(updateIssueDto, req.body);

      const errors = await validate(updateIssueDto);
      if (errors.length > 0) {
        next(new ApiError(400, 'Validation failed'));
        return;
      }

      const updatedIssue = await this.issueService.update(id, updateIssueDto);
      if (!updatedIssue) {
        next(new ApiError(404, `Issue with ID "${id}" not found or update failed.`));
        return;
      }
      res.status(200).json(updatedIssue);
    } catch (error) {
      next(error);
    }
  }

  // DELETE /issues/:id
  async deleteIssue(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.issueService.delete(id);
      res.status(204).send(); // No Content
    } catch (error) {
      next(error);
    }
  }
}
