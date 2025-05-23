import { Request, Response, NextFunction } from 'express';
import { injectable, inject, container } from 'tsyringe'; // Import container if resolving directly
import { EpicService } from '../../app/services/epic.service'; // Adjusted path
import { CreateEpicDto, UpdateEpicDto } from '../../domain/DTOs/epicDTO'; // Adjusted path
import { validate } from 'class-validator'; // For DTO validation
import { ApiError } from '../middlewares/error.middleware';

@injectable()
export class EpicController {
  constructor(
    @inject(EpicService) private readonly epicService: EpicService
  ) {}
  // POST /epics
  async createEpic(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const createEpicDto = new CreateEpicDto();
      Object.assign(createEpicDto, req.body);

      const errors = await validate(createEpicDto);
      if (errors.length > 0) {
        next(new ApiError(400, 'Validation failed'));
        return;
      }

      const epic = await this.epicService.create(createEpicDto);
      res.status(201).json(epic);
    } catch (error) {
      // Pass all errors to the centralized error handler
      next(error);
    }
  }

  // GET /epics
  async getAllEpics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const epics = await this.epicService.getAll();
      res.status(200).json(epics);
    } catch (error) {
      next(error);
    }
  }
  // GET /epics/:id
  async getEpicById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const epic = await this.epicService.getById(id);
      if (!epic) {
        next(new ApiError(404, `Epic with ID "${id}" not found.`));
        return;
      }
      res.status(200).json(epic);
    } catch (error) {
      next(error);
    }
  }  // GET /epics/board/:boardProjectId/key/:key
  async getEpicByKeyAndBoard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { key, boardProjectId } = req.params;
      // Handle the special case where boardProjectId is "null" as a string
      const boardId = boardProjectId === "null" ? null : boardProjectId;
      
      const epic = await this.epicService.getByKeyAndBoard(key, boardId);
      
      if (!epic) {
        const boardMessage = boardId ? `in board "${boardProjectId}"` : "without a board";
        next(new ApiError(404, `Epic with key "${key}" ${boardMessage} not found.`));
        return;
      }
      
      res.status(200).json(epic);
    } catch (error) {
      next(error);
    }
  }
  // GET /epics/board/:boardProjectId
  async getEpicsByBoard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { boardProjectId } = req.params;
      if (!boardProjectId) {
        next(new ApiError(400, "BoardProjectId parameter is required"));
        return;
      }
      const epics = await this.epicService.getByBoard(boardProjectId);
      res.status(200).json(epics);
    } catch (error) {
      next(error);
    }
  }
  // PUT /epics/:id
  async updateEpic(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updateEpicDto = new UpdateEpicDto();
      Object.assign(updateEpicDto, req.body);

      const errors = await validate(updateEpicDto); // Validate optional fields too
      if (errors.length > 0) {
        next(new ApiError(400, 'Validation failed'));
        return;
      }

      const updatedEpic = await this.epicService.update(id, updateEpicDto);
      if (!updatedEpic) {
        next(new ApiError(404, `Epic with ID "${id}" not found or update failed.`));
        return;
      }
      res.status(200).json(updatedEpic);
    } catch (error) {
      // Let the centralized error handler deal with all errors
      next(error);
    }
  }

  // DELETE /epics/:id
  async deleteEpic(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.epicService.delete(id);
      res.status(204).send(); // No Content
    } catch (error) {
      // Let the centralized error handler deal with all errors
      next(error);
    }
  }
}

