import { injectable, inject } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { EpicService } from "../../app/services/epic.service";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { CreateEpicDto, UpdateEpicDto } from "../../domain/DTOs/epicDTO";
import { UserError } from "../../app/exceptions";

@injectable()
export class EpicController {
  constructor(@inject(EpicService) private epicService: EpicService) {}

  async getAllEpics(req: Request, res: Response, next: NextFunction) {
    try {
      const { boardProjectId } = req.params;
      const epics = await this.epicService.getAllEpics(boardProjectId);
      res.status(200).json({ epics, success: true });
    } catch (error) {
      next(error);
    }
  }

  async getEpicById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const epic = await this.epicService.getEpicById(id);
      res.status(200).json({ epic, success: true });
    } catch (error) {
      next(error);
    }
  }

  async getEpicByKey(req: Request, res: Response, next: NextFunction) {
    try {
      const { key, boardProjectId } = req.params;
      const epic = await this.epicService.getEpicByKey(key, boardProjectId);
      res.status(200).json({ epic, success: true });
    } catch (error) {
      next(error);
    }
  }

  async createEpic(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = plainToInstance(CreateEpicDto, req.body);
      const errors = await validate(dto);
      if (errors.length) {
        throw new UserError(errors);
      }
      
      const epic = await this.epicService.createEpic(dto);
      res.status(201).json({ epic, success: true });
    } catch (error) {
      next(error);
    }
  }

  async updateEpic(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const dto = plainToInstance(UpdateEpicDto, req.body);
      const errors = await validate(dto);
      if (errors.length) {
        throw new UserError(errors);
      }
      
      const updatedEpic = await this.epicService.updateEpic(id, dto);
      res.status(200).json({ epic: updatedEpic, success: true });
    } catch (error) {
      next(error);
    }
  }

  async deleteEpic(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await this.epicService.deleteEpic(id);
      res.status(200).json({ success: true, message: "Epic deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}
