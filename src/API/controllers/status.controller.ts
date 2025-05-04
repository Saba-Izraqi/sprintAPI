import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { StatusService } from "../../app/services/status.service";
import {
  CreateStatusDto,
  UpdateStatusDto,
} from "../../domain/DTOs/statusDTO"; 
import { StatusType } from "../../domain/entities/status.entity"; 

@injectable()
export class StatusController {
  constructor(
    @inject(StatusService) private readonly statusService: StatusService
  ) {}

  private handleError(error: unknown): { message: string } {
    if (error instanceof Error) {
      return { message: error.message };
    }
    return { message: "An unexpected error occurred" };
  }

 
  async createStatus(req: Request, res: Response): Promise<void> {
    try {
      const dto: CreateStatusDto = req.body;
      const result = await this.statusService.createStatus(dto);
      
      res.status(201).json(result);
    } catch (error) {
      const { message } = this.handleError(error);
      
      res.status(400).json({ error: message });
    }
  }

  async getStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.statusService.getStatusById(id);
    
      res.status(200).json(result);
    } catch (error) {
      const { message } = this.handleError(error);
      
      res.status(404).json({ error: message });
    }
  }

  async getAllStatuses(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.statusService.getAllStatuses();
      // --- REMOVED 'return' ---
      res.status(200).json(result);
    } catch (error) {
      const { message } = this.handleError(error);
      // --- REMOVED 'return' ---
      res.status(500).json({ error: message });
    }
  }

  async getStatusesByColumn(req: Request, res: Response): Promise<void> {
    try {
      const { columnId } = req.params;
      const result = await this.statusService.getStatusesByColumn(columnId);
      
      res.status(200).json(result);
    } catch (error) {
      const { message } = this.handleError(error);
      
      res.status(400).json({ error: message });
    }
  }

  async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const dto: UpdateStatusDto = req.body;
      const result = await this.statusService.updateStatus(id, dto);
     
      res.status(200).json(result);
    } catch (error) {
      const { message } = this.handleError(error);
      const statusCode = message.includes("not found") ? 404 : 400;
     
      res.status(statusCode).json({ error: message });
    }
  }

  async deleteStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.statusService.deleteStatus(id);
      
      res.status(204).send(); 
    } catch (error) {
      const { message } = this.handleError(error);
      const statusCode = message.includes("not found") ? 404 : 400;
    
      res.status(statusCode).json({ error: message });
    }
  }

  async changeStatusType(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { newType } = req.body;

      if (!Object.values(StatusType).includes(newType)) {
        
        res.status(400).json({ error: "Invalid status type" });
        return; 
      }

      const result = await this.statusService.changeStatusType(id, newType);
      res.status(200).json(result);
    } catch (error) {
      const { message } = this.handleError(error);
      const statusCode = message.includes("not found") ? 404 : 400;
      res.status(statusCode).json({ error: message });
    }
  }
}