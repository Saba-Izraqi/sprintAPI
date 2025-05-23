import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";
import { StatusService } from "../../app/services/status.service";
import { CreateStatusDto, UpdateStatusDto } from "../../domain/DTOs/statusDTO";
import { StatusType } from "../../domain/entities/status.entity";
import { ApiError } from "../middlewares/error.middleware";

@injectable()
export class StatusController {
  constructor(
    @inject(StatusService) private readonly statusService: StatusService
  ) {}

  async createStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const createStatusDto = req.body as CreateStatusDto;
      const statusResponse = await this.statusService.create(createStatusDto);
      res.status(201).json(statusResponse);
    } catch (error) {
      next(error);
    }
  }

  async getAllStatuses(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const statuses = await this.statusService.getAll();
      res.status(200).json(statuses);
    } catch (error) {
      next(error);
    }
  }

  async getStatusById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const status = await this.statusService.getById(id);
      
      if (!status) {
        throw new ApiError(404, `Status with ID "${id}" not found.`);
      }
      
      res.status(200).json(status);
    } catch (error) {
      next(error);
    }
  }
  
  async getStatusesByType(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const typeParam = req.params.type;
      const type = Number(typeParam);
      
      // Validate that the type is a valid StatusType
      if (isNaN(type) || !Object.values(StatusType).includes(type)) {
        throw new ApiError(400, `Invalid status type: ${typeParam}. Must be one of: ${Object.values(StatusType).filter(v => typeof v === 'number').join(', ')}`);
      }
      
      const statuses = await this.statusService.getByType(type as StatusType);
      res.status(200).json(statuses);
    } catch (error) {
      next(error);
    }
  }
  
  async getStatusesByColumn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { columnId } = req.params;
      const statuses = await this.statusService.getByColumn(columnId);
      res.status(200).json(statuses);
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updateStatusDto = req.body as UpdateStatusDto;
      
      const updatedStatus = await this.statusService.update(id, updateStatusDto);
      res.status(200).json(updatedStatus);
    } catch (error) {
      next(error);
    }
  }

  async deleteStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.statusService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
