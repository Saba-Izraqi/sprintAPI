import { Request, Response, NextFunction } from "express";
import { IssueService } from "../../app/services/issue.service";
import { CreateIssueDto, UpdateIssueDto } from "../../domain/DTOs/issueDTO";
import { injectable, inject } from "tsyringe";
import { parseIssueQueryParams } from "../utils/query-parser";

@injectable()
export class IssueController {
  constructor(@inject(IssueService) private issueService: IssueService) {}  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      const createIssueDto = (req as any).validatedData as CreateIssueDto;
      // No need to manually assign projectId - it's already merged by validateDTOWithParams

      const issue = await this.issueService.create(userId!, createIssueDto);
      res.status(201).json({
        message: "Issue created successfully",
        data: issue,
      });
    } catch (error) {
      next(error);
    }
  }
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { projectId } = req.params;
      const userId = req.user?.userId;
      const options = parseIssueQueryParams(req);

      const result = await this.issueService.getAll(userId!, projectId, options);
      res.status(200).json({
        message: "Issues retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      const issue = await this.issueService.getById(userId!, id);
      res.status(200).json({
        message: "Issue retrieved successfully",
        data: issue,
      });
    } catch (error) {
      next(error);
    }
  }
  async getByKey(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { key } = req.params;
      const userId = req.user?.userId;

      const issue = await this.issueService.getByKey(userId!, key);
      res.status(200).json({
        message: "Issue retrieved successfully",
        data: issue,
      });
    } catch (error) {
      next(error);
    }
  }
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const updateIssueDto = (req as any).validatedData as UpdateIssueDto;

      const issue = await this.issueService.update(userId!, id, updateIssueDto);
      res.status(200).json({
        message: "Issue updated successfully",
        data: issue,
      });
    } catch (error) {
      next(error);
    }
  }
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      await this.issueService.delete(userId!, id);
      res.status(200).json({
        message: "Issue deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }  async getMyAssigned(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      const options = parseIssueQueryParams(req);
      const { projectId } = req.query;

      const issues = await this.issueService.getMyAssigned(
        userId!,
        projectId as string | undefined,
        options
      );

      res.status(200).json({
        message: "Assigned issues retrieved successfully",
        data: issues,
      });
    } catch (error) {
      next(error);
    }
  }  async getBySprint(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sprintId } = req.params;
      const userId = req.user?.userId;
      const options = parseIssueQueryParams(req);

      const issues = await this.issueService.getBySprint(userId!, sprintId, options);
      res.status(200).json({
        message: "Sprint issues retrieved successfully",
        data: issues,
      });
    } catch (error) {
      next(error);
    }
  }  async getByEpic(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { epicId } = req.params;
      const userId = req.user?.userId;
      const options = parseIssueQueryParams(req);

      const issues = await this.issueService.getByEpic(userId!, epicId, options);
      res.status(200).json({
        message: "Epic issues retrieved successfully",
        data: issues,
      });
    } catch (error) {
      next(error);
    }
  }
}
