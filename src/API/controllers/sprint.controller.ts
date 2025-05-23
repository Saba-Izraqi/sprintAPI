import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { SprintService } from '../../app/services/sprint.service';
import { CreateSprintDto, UpdateSprintDto } from '../../domain/DTOs/sprintDTO';
import { validate } from 'class-validator';
import { ApiError } from '../middlewares/error.middleware';

@injectable()
export class SprintController {
  constructor(
    @inject(SprintService) private readonly sprintService: SprintService
  ) {}

  // POST /sprints
  async createSprint(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const createSprintDto = new CreateSprintDto();
      Object.assign(createSprintDto, req.body);

      const errors = await validate(createSprintDto);
      if (errors.length > 0) {
        next(new ApiError(400, 'Validation failed'));
        return;
      }

      const sprint = await this.sprintService.create(createSprintDto);
      res.status(201).json(sprint);
    } catch (error) {
      next(error);
    }
  }

  // GET /sprints
  async getAllSprints(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sprints = await this.sprintService.getAll();
      res.status(200).json(sprints);
    } catch (error) {
      next(error);
    }
  }

  // GET /sprints/:id
  async getSprintById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const sprint = await this.sprintService.getById(id);
      if (!sprint) {
        next(new ApiError(404, `Sprint with ID "${id}" not found.`));
        return;
      }
      res.status(200).json(sprint);
    } catch (error) {
      next(error);
    }
  }

  // GET /sprints/board/:boardProjectId
  async getSprintsByBoard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { boardProjectId } = req.params;
      if (!boardProjectId) {
        next(new ApiError(400, "BoardProjectId parameter is required"));
        return;
      }
      const sprints = await this.sprintService.getByBoardProjectId(boardProjectId);
      res.status(200).json(sprints);
    } catch (error) {
      next(error);
    }
  }

  // GET /sprints/daterange
  async getSprintsByDateRange(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        next(new ApiError(400, "Both startDate and endDate query parameters are required"));
        return;
      }
      
      const sprints = await this.sprintService.getByDateRange(startDate as string, endDate as string);
      res.status(200).json(sprints);
    } catch (error) {
      next(error);
    }
  }

  // GET /sprints/active
  async getActiveSprints(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sprints = await this.sprintService.getActiveSprints();
      res.status(200).json(sprints);
    } catch (error) {
      next(error);
    }
  }

  // PUT /sprints/:id
  async updateSprint(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updateSprintDto = new UpdateSprintDto();
      Object.assign(updateSprintDto, req.body);

      const errors = await validate(updateSprintDto);
      if (errors.length > 0) {
        next(new ApiError(400, 'Validation failed'));
        return;
      }

      const updatedSprint = await this.sprintService.update(id, updateSprintDto);
      if (!updatedSprint) {
        next(new ApiError(404, `Sprint with ID "${id}" not found or update failed.`));
        return;
      }
      res.status(200).json(updatedSprint);
    } catch (error) {
      next(error);
    }
  }

  // DELETE /sprints/:id
  async deleteSprint(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.sprintService.delete(id);
      res.status(204).send(); // No Content
    } catch (error) {
      next(error);
    }
  }
}
