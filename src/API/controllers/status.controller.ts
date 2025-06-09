import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { StatusService } from "../../app/services/status.service";
import { CreateStatusDto, UpdateStatusDto } from "../../domain/DTOs/statusDTO";

@injectable()
export class StatusController {
  constructor(
    @inject(StatusService) private statusService: StatusService
  ) {}

  async createStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = (req as any).validatedData as CreateStatusDto;
      const status = await this.statusService.createStatus(dto);
      
      res.status(201).json({
        message: "Status created successfully",
        data: status,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  async getStatusById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const status = await this.statusService.getStatusById(id);
      
      res.status(200).json({
        message: "Status retrieved successfully",
        data: status,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  async getStatusesByColumn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { columnId } = req.params;
      const statuses = await this.statusService.getStatusesByColumn(columnId);
      
      res.status(200).json({
        message: "Statuses retrieved successfully",
        data: statuses,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllStatuses(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const statuses = await this.statusService.getAllStatuses();
      
      res.status(200).json({
        message: "All statuses retrieved successfully",
        data: statuses,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const dto = (req as any).validatedData as UpdateStatusDto;
      const status = await this.statusService.updateStatus(id, dto);
      
      res.status(200).json({
        message: "Status updated successfully",
        data: status,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.statusService.deleteStatus(id);
      
      res.status(200).json({
        message: "Status deleted successfully",
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }
}
